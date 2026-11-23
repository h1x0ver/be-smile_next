import fs from 'node:fs';
import draco from 'draco3d';
import * as T from 'three';
const b=fs.readFileSync('public/models/molar-source.glb');
const j=JSON.parse(b.toString('utf8',20,20+b.readUInt32LE(12)));
const offset=20+b.readUInt32LE(12)+8;
const prim=j.meshes[0].primitives[0], ext=prim.extensions.KHR_draco_mesh_compression;
const view=j.bufferViews[ext.bufferView];
const D=await draco.createDecoderModule({});
const decoder=new D.Decoder(), db=new D.DecoderBuffer();
const data=b.subarray(offset+view.byteOffset,offset+view.byteOffset+view.byteLength);db.Init(data,data.length);
const mesh=new D.Mesh();decoder.DecodeBufferToMesh(db,mesh);
const attr=decoder.GetAttributeByUniqueId(mesh,ext.attributes.POSITION), vals=new D.DracoFloat32Array();decoder.GetAttributeFloatForAllPoints(mesh,attr,vals);
let vertices=[];for(let i=0;i<mesh.num_points();i++) vertices.push([vals.GetValue(i*3),vals.GetValue(i*3+1),vals.GetValue(i*3+2)]);
let faces=[];const face=new D.DracoInt32Array();for(let i=0;i<mesh.num_faces();i++){decoder.GetFaceFromMesh(mesh,i,face);faces.push([face.GetValue(0),face.GetValue(1),face.GetValue(2)]);}
// Weld UV/color seams before smooth subdivision.
const welded=[], map=new Map(), remap=[];for(const v of vertices){const key=v.map(n=>n.toFixed(5)).join(',');if(!map.has(key)){map.set(key,welded.length);welded.push(v);}remap.push(map.get(key));}vertices=welded;faces=faces.map(f=>f.map(i=>remap[i]));
for(let step=0;step<2;step++){
 const neighbors=vertices.map(()=>new Set()), edges=new Map();
 for(const [a,b,c] of faces)for(const [i,k,o] of [[a,b,c],[b,c,a],[c,a,b]]){neighbors[i].add(k);neighbors[k].add(i);const key=[Math.min(i,k),Math.max(i,k)].join(',');if(!edges.has(key))edges.set(key,{a:i,b:k,op:[]});edges.get(key).op.push(o);}
 const next=vertices.map((v,i)=>{const ns=[...neighbors[i]], n=ns.length;if(!n)return v;const beta=n===3?3/16:3/(8*n);return v.map((c,k)=>(1-n*beta)*c+beta*ns.reduce((sum,j)=>sum+vertices[j][k],0));});
 for(const edge of edges.values()){edge.index=next.length;next.push([0,1,2].map(k=>edge.op.length===2?3/8*(vertices[edge.a][k]+vertices[edge.b][k])+1/8*(vertices[edge.op[0]][k]+vertices[edge.op[1]][k]):.5*(vertices[edge.a][k]+vertices[edge.b][k])));}
 const mid=(a,b)=>edges.get([Math.min(a,b),Math.max(a,b)].join(',')).index;
 faces=faces.flatMap(([a,b,c])=>{const ab=mid(a,b),bc=mid(b,c),ca=mid(c,a);return [[a,ab,ca],[b,bc,ab],[c,ca,bc],[ab,bc,ca]];});vertices=next;
}
const q=new T.Quaternion(...j.nodes[0].rotation);
const points=vertices.map(v=>new T.Vector3(...v).applyQuaternion(q));
const box=new T.Box3().setFromPoints(points),center=box.getCenter(new T.Vector3()),size=box.getSize(new T.Vector3());console.log('source bounds',size.toArray());
const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(points.flatMap(v=>v.sub(center).multiplyScalar(2.7/size.y).toArray()),3));g.setIndex(faces.flat());g.computeVertexNormals();g.computeBoundingBox();
const arrays=[g.attributes.position.array,g.attributes.normal.array,new Uint16Array(g.index.array)];let byteOffset=0;const bufferViews=arrays.map(a=>{const r={buffer:0,byteOffset,byteLength:a.byteLength};byteOffset+=a.byteLength;return r;});
const metadata={asset:{version:'2.0',generator:'BeSmile anatomy preparation',copyright:'University of Dundee, School of Dentistry. CC BY 4.0. Smooth subdivision, normalization, materials modified.',extras:{source:j.asset.extras.source,license:'https://creativecommons.org/licenses/by/4.0/'}},buffers:[{byteLength:byteOffset}],bufferViews,accessors:[{bufferView:0,componentType:5126,count:arrays[0].length/3,type:'VEC3',min:g.boundingBox.min.toArray(),max:g.boundingBox.max.toArray()},{bufferView:1,componentType:5126,count:arrays[1].length/3,type:'VEC3'},{bufferView:2,componentType:5123,count:arrays[2].length,type:'SCALAR'}],meshes:[{primitives:[{attributes:{POSITION:0,NORMAL:1},indices:2}]}],nodes:[{mesh:0}],scenes:[{nodes:[0]}],scene:0};
let json=Buffer.from(JSON.stringify(metadata));json=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,32)]);const binary=Buffer.concat(arrays.map(a=>Buffer.from(a.buffer,a.byteOffset,a.byteLength)));const header=Buffer.alloc(20);header.write('glTF');header.writeUInt32LE(2,4);header.writeUInt32LE(28+json.length+binary.length,8);header.writeUInt32LE(json.length,12);header.writeUInt32LE(0x4e4f534a,16);const chunk=Buffer.alloc(8);chunk.writeUInt32LE(binary.length);chunk.writeUInt32LE(0x004e4942,4);fs.writeFileSync('public/models/molar.glb',Buffer.concat([header,json,chunk,binary]));console.log('output',vertices.length,faces.length,binary.length);
for(const obj of [vals,face,mesh,db,decoder])D.destroy(obj);
