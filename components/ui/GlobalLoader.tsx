import SmileWave from "./SmileWave";

export default function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center">
      <div className="text-primary animate-pulse">
        <SmileWave />
      </div>

      <div className="mt-8 w-48 h-[2px] bg-gray-200 overflow-hidden rounded">
        <div className="h-full bg-primary animate-loader-bar" />
      </div>
    </div>
  );
}
