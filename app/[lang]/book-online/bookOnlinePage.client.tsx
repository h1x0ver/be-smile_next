"use client";

import {
  forwardRef,
  type ButtonHTMLAttributes,
  type FormEvent,
  type ReactNode,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import SearchParamWatcher from "@/components/SearchParamWatcher";
import * as Popover from "@radix-ui/react-popover";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { enUS, ru, az } from "date-fns/locale";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CalendarPlus,
  Check,
  ChevronDown,
  Clock3,
  Loader2,
  Phone,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "react-day-picker/dist/style.css";

type Lang = "ru" | "en" | "az";

type SubmitStatus = {
  type: "success" | "error" | null;
  message: string;
};

type ConfirmedBooking = {
  name: string;
  phone: string;
  date: Date;
  time: string;
};

type FormDataState = {
  name: string;
  phone: string;
  date: Date | undefined;
  time: string;
  message: string;
};

type Content = {
  badge: string;
  back: string;
  eyebrow: string;
  titleTop: string;
  titleBottom: string;
  description: string;

  name: string;
  namePlaceholder: string;
  phone: string;
  phonePlaceholder: string;

  date: string;
  datePlaceholder: string;
  dateMeta: string;
  dateOpen: string;
  datePopoverTitle: string;
  datePopoverText: string;
  dateToday: string;
  dateClear: string;

  time: string;
  timePlaceholder: string;
  timeMeta: string;
  timeOpen: string;
  timePopoverTitle: string;
  timePopoverText: string;

  morning: string;
  afternoon: string;
  evening: string;

  message: string;
  messagePlaceholder: string;

  submit: string;
  submitting: string;
  success: string;
  error: string;
  scheduleRequired: string;

  note: string;
  benefit1: string;
  benefit2: string;
  benefit3: string;

  sideLabel: string;
  sideTitleTop: string;
  sideTitleBottom: string;
  sideText: string;
  addressLabel: string;
  phoneLabel: string;

  step1: string;
  step2: string;
  step3: string;

  microTitle: string;
  microText: string;

  progressLabel: string;
  progressDone: string;

  successBadge: string;
  successTitle: string;
  successText: string;
  successDate: string;
  successTime: string;
  successName: string;
  successAddToCalendar: string;
  successBookAnother: string;
  successCallUs: string;
};

// Время работы расширено до 20:00
const TIME_GROUPS = {
  morning: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"],
  afternoon: ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00"],
  evening: [
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
  ],
};

const CONTENT: Record<Lang, Content> = {
  ru: {
    badge: "BESMILE · BAKU",
    back: "Назад",
    eyebrow: "Запись на приём",
    titleTop: "Запись",
    titleBottom: "на приём",
    description:
      "Выберите удобную дату и время. Мы свяжемся с вами для подтверждения записи.",

    name: "Имя",
    namePlaceholder: "Введите ваше имя",
    phone: "Телефон",
    phonePlaceholder: "+994",

    date: "Дата визита",
    datePlaceholder: "Выберите дату",
    dateMeta: "DATE",
    dateOpen: "Открыть",
    datePopoverTitle: "Выберите дату",
    datePopoverText: "Отметьте удобный день для визита.",
    dateToday: "Сегодня",
    dateClear: "Очистить",

    time: "Время",
    timePlaceholder: "Выберите время",
    timeMeta: "TIME",
    timeOpen: "Открыть",
    timePopoverTitle: "Выберите время",
    timePopoverText: "Укажите желаемое время приёма.",
    morning: "Утро",
    afternoon: "День",
    evening: "Вечер",

    message: "Комментарий",
    messagePlaceholder:
      "Например: консультация, чистка, виниры, имплантация",

    submit: "Подтвердить запись",
    submitting: "Отправляем...",
    success: "Заявка отправлена. Мы скоро свяжемся с вами.",
    error: "Произошла ошибка. Попробуйте ещё раз.",
    scheduleRequired: "Выберите дату и время визита.",

    note: "Подтверждение по телефону.",
    benefit1: "Конфиденциально",
    benefit2: "Быстрое подтверждение",
    benefit3: "Удобное время",

    sideLabel: "Запись на приём",
    sideTitleTop: "Выберите",
    sideTitleBottom: "удобное время",
    sideText: "Оставьте заявку — мы свяжемся с вами для подтверждения записи.",
    addressLabel: "Адрес",
    phoneLabel: "Телефон",

    step1: "Выберите дату",
    step2: "Укажите время",
    step3: "Мы подтвердим",

    microTitle: "Как проходит запись",
    microText:
      "После отправки заявки администратор уточнит детали и подтвердит удобное время визита.",

    progressLabel: "Заполнено полей",
    progressDone: "Всё готово",

    successBadge: "Заявка принята",
    successTitle: "Вы записаны",
    successText:
      "Мы получили вашу заявку и свяжемся с вами по телефону для подтверждения.",
    successDate: "Дата",
    successTime: "Время",
    successName: "Имя",
    successAddToCalendar: "Добавить в календарь",
    successBookAnother: "Записать ещё раз",
    successCallUs: "Или позвоните нам сами",
  },
  en: {
    badge: "BESMILE · BAKU",
    back: "Back",
    eyebrow: "Appointment booking",
    titleTop: "Book",
    titleBottom: "your visit",
    description:
      "Choose a convenient date and time. We will contact you to confirm the appointment.",

    name: "Name",
    namePlaceholder: "Enter your name",
    phone: "Phone",
    phonePlaceholder: "+994",

    date: "Visit date",
    datePlaceholder: "Choose a date",
    dateMeta: "DATE",
    dateOpen: "Open",
    datePopoverTitle: "Choose a date",
    datePopoverText: "Select a comfortable day for your visit.",
    dateToday: "Today",
    dateClear: "Clear",

    time: "Time",
    timePlaceholder: "Choose a time",
    timeMeta: "TIME",
    timeOpen: "Open",
    timePopoverTitle: "Choose a time",
    timePopoverText: "Select your preferred appointment time.",
    morning: "Morning",
    afternoon: "Afternoon",
    evening: "Evening",

    message: "Message",
    messagePlaceholder: "For example: consultation, cleaning, veneers, implants",

    submit: "Confirm booking",
    submitting: "Sending...",
    success: "Request sent. We will contact you soon.",
    error: "Something went wrong. Please try again.",
    scheduleRequired: "Please choose a visit date and time.",

    note: "Confirmation by phone.",
    benefit1: "Private",
    benefit2: "Fast confirmation",
    benefit3: "Flexible timing",

    sideLabel: "Appointment booking",
    sideTitleTop: "Choose",
    sideTitleBottom: "your time",
    sideText: "Leave a request — we will contact you to confirm the appointment.",
    addressLabel: "Address",
    phoneLabel: "Phone",

    step1: "Choose date",
    step2: "Select time",
    step3: "We confirm",

    microTitle: "How booking works",
    microText:
      "After you submit the request, our administrator will confirm the details and appointment time.",

    progressLabel: "Fields completed",
    progressDone: "All set",

    successBadge: "Request received",
    successTitle: "You're booked",
    successText:
      "We've received your request and will call you shortly to confirm.",
    successDate: "Date",
    successTime: "Time",
    successName: "Name",
    successAddToCalendar: "Add to calendar",
    successBookAnother: "Book another visit",
    successCallUs: "Or call us directly",
  },
  az: {
    badge: "BESMILE · BAKU",
    back: "Geri",
    eyebrow: "Qəbula yazılış",
    titleTop: "Qəbula",
    titleBottom: "yazılın",
    description:
      "Uyğun tarix və vaxt seçin. Qəbulu təsdiqləmək üçün sizinlə əlaqə saxlayacağıq.",

    name: "Ad",
    namePlaceholder: "Adınızı daxil edin",
    phone: "Telefon",
    phonePlaceholder: "+994",

    date: "Qəbul tarixi",
    datePlaceholder: "Tarixi seçin",
    dateMeta: "DATE",
    dateOpen: "Aç",
    datePopoverTitle: "Tarix seçin",
    datePopoverText: "Qəbul üçün uyğun günü seçin.",
    dateToday: "Bu gün",
    dateClear: "Təmizlə",

    time: "Vaxt",
    timePlaceholder: "Vaxtı seçin",
    timeMeta: "TIME",
    timeOpen: "Aç",
    timePopoverTitle: "Vaxt seçin",
    timePopoverText: "Qəbul üçün istədiyiniz saatı seçin.",
    morning: "Səhər",
    afternoon: "Günorta",
    evening: "Axşam",

    message: "Mesaj",
    messagePlaceholder: "Məsələn: konsultasiya, təmizlik, vinir, implantasiya",

    submit: "Qəbulu təsdiqlə",
    submitting: "Göndərilir...",
    success: "Müraciət göndərildi. Tezliklə əlaqə saxlayacağıq.",
    error: "Xəta baş verdi. Yenidən cəhd edin.",
    scheduleRequired: "Qəbul tarixi və vaxtını seçin.",

    note: "Telefonla təsdiqləmə.",
    benefit1: "Məxfi",
    benefit2: "Sürətli təsdiq",
    benefit3: "Uyğun vaxt",

    sideLabel: "Qəbula yazılış",
    sideTitleTop: "Uyğun",
    sideTitleBottom: "vaxt seçin",
    sideText:
      "Müraciət göndərin — qəbulu təsdiqləmək üçün sizinlə əlaqə saxlayacağıq.",
    addressLabel: "Ünvan",
    phoneLabel: "Telefon",

    step1: "Tarix seçin",
    step2: "Vaxt seçin",
    step3: "Təsdiq edirik",

    microTitle: "Yazılış necə aparılır",
    microText:
      "Müraciətdən sonra administrator detalları dəqiqləşdirəcək və vaxtı təsdiqləyəcək.",

    progressLabel: "Doldurulmuş sahələr",
    progressDone: "Hər şey hazırdır",

    successBadge: "Müraciət qəbul edildi",
    successTitle: "Siz qeydiyyatdan keçdiniz",
    successText:
      "Müraciətinizi aldıq və təsdiq üçün tezliklə sizinlə əlaqə saxlayacağıq.",
    successDate: "Tarix",
    successTime: "Vaxt",
    successName: "Ad",
    successAddToCalendar: "Təqvimə əlavə et",
    successBookAnother: "Yenidən yazıl",
    successCallUs: "Və ya bizə özünüz zəng edin",
  },
};

const INITIAL_FORM: FormDataState = {
  name: "",
  phone: "",
  date: undefined,
  time: "",
  message: "",
};

function localeByLang(lang: Lang) {
  if (lang === "ru") return ru;
  if (lang === "az") return az;
  return enUS;
}

function formatDateValue(date: Date | undefined, lang: Lang) {
  if (!date) return "";
  return format(date, "dd MMM yyyy", { locale: localeByLang(lang) });
}

function todayStart() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1], delay },
  } as const;
}

function FieldLabel({
  children,
  sideText,
}: {
  children: ReactNode;
  sideText?: string;
}) {
  return (
    <div className="mb-2 flex items-center justify-between gap-4">
      <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-black/50">
        {children}
      </label>

      {sideText ? (
        <span className="text-[10px] uppercase tracking-[0.18em] text-black/30">
          {sideText}
        </span>
      ) : null}
    </div>
  );
}

function InputShell({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[22px] border border-white/75 bg-white/82 px-4 py-3 shadow-[0_16px_46px_rgba(0,0,0,0.05)] backdrop-blur-xl transition duration-300 focus-within:border-[#b08b57]/35 focus-within:bg-white focus-within:shadow-[0_18px_54px_rgba(176,139,87,0.10)]">
      {children}
    </div>
  );
}

type PickerButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> & {
  icon: LucideIcon;
  meta: string;
  placeholder: string;
  value: string;
  openText: string;
};

const PickerButton = forwardRef<HTMLButtonElement, PickerButtonProps>(
  function PickerButton(
    { icon: Icon, meta, placeholder, value, openText, ...props },
    ref
  ) {
    const filled = Boolean(value);

    return (
      <button
        ref={ref}
        type="button"
        {...props}
        className="group flex min-h-[64px] w-full items-center justify-between gap-4 rounded-[24px] border border-white/75 bg-white/84 px-4 text-left shadow-[0_16px_46px_rgba(0,0,0,0.05)] backdrop-blur-xl transition duration-300 hover:-translate-y-[1px] hover:bg-white hover:shadow-[0_18px_54px_rgba(176,139,87,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b08b57]/25"
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d8ccb7] bg-[#f5eee0] text-[#927140] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
            <Icon className="h-[15px] w-[15px]" strokeWidth={1.7} />
          </span>

          <span className="min-w-0">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-black/34">
              {meta}
            </span>

            <span
              className={`mt-0.5 block truncate text-[14px] ${
                filled ? "text-[#111]" : "text-black/36"
              }`}
            >
              {value || placeholder}
            </span>
          </span>
        </span>

        <span className="flex shrink-0 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/34">
          <span className="hidden sm:inline">{openText}</span>
          <ChevronDown className="h-4 w-4 transition group-data-[state=open]:rotate-180" />
        </span>
      </button>
    );
  }
);

function PremiumDatePicker({
  lang,
  t,
  value,
  onChange,
}: {
  lang: Lang;
  t: Content;
  value: Date | undefined;
  onChange: (value: Date | undefined) => void;
}) {
  // Поповер теперь контролируемый — закрывается сразу после выбора даты
  const [open, setOpen] = useState(false);

  const handleSelect = (date: Date | undefined) => {
    onChange(date);
    setOpen(false);
  };

  const handleToday = () => {
    onChange(new Date());
    setOpen(false);
  };

  return (
    <div>
      <FieldLabel>{t.date}</FieldLabel>

      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <PickerButton
            icon={CalendarDays}
            meta={t.dateMeta}
            placeholder={t.datePlaceholder}
            value={formatDateValue(value, lang)}
            openText={t.dateOpen}
          />
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            sideOffset={10}
            align="start"
            className="z-[9999] w-[min(92vw,390px)] rounded-[30px] border border-white/75 bg-[#fbfaf7]/96 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.16)] backdrop-blur-2xl outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <div className="text-[24px] font-[300] leading-tight tracking-[-0.04em] text-[#111]">
                  {t.datePopoverTitle}
                </div>

                <p className="mt-1 text-[13px] leading-6 text-black/54">
                  {t.datePopoverText}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onChange(undefined)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/8 bg-white text-black/42 transition hover:text-black/70"
                aria-label={t.dateClear}
              >
                <X className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>

            <div className="booking-calendar-premium">
              <DayPicker
                mode="single"
                selected={value}
                onSelect={handleSelect}
                locale={localeByLang(lang)}
                disabled={{ before: todayStart() }}
                showOutsideDays
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-black/6 pt-4">
              <button
                type="button"
                onClick={handleToday}
                className="inline-flex min-h-[40px] items-center justify-center rounded-full border border-black/8 bg-white px-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-black/52 transition hover:bg-[#f5eee0]"
              >
                {t.dateToday}
              </button>

              <button
                type="button"
                onClick={() => onChange(undefined)}
                className="inline-flex min-h-[40px] items-center justify-center rounded-full px-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-black/34 transition hover:text-black/60"
              >
                {t.dateClear}
              </button>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}

function SlotGroup({
  title,
  slots,
  value,
  onChange,
}: {
  title: string;
  slots: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-black/34">
        {title}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {slots.map((slot) => {
          const active = value === slot;

          return (
            <button
              key={slot}
              type="button"
              onClick={() => onChange(slot)}
              className={`inline-flex min-h-[42px] items-center justify-center rounded-full border text-[12px] font-semibold tracking-[0.08em] transition duration-300 ${
                active
                  ? "border-[#111] bg-[#111] text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
                  : "border-black/8 bg-white/78 text-black/58 hover:bg-white hover:text-black/76"
              }`}
            >
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PremiumTimePicker({
  t,
  value,
  onChange,
}: {
  t: Content;
  value: string;
  onChange: (value: string) => void;
}) {
  // Поповер теперь контролируемый — закрывается сразу после выбора слота
  const [open, setOpen] = useState(false);

  const handleSelect = (slot: string) => {
    onChange(slot);
    setOpen(false);
  };

  return (
    <div>
      <FieldLabel>{t.time}</FieldLabel>

      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <PickerButton
            icon={Clock3}
            meta={t.timeMeta}
            placeholder={t.timePlaceholder}
            value={value}
            openText={t.timeOpen}
          />
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            sideOffset={10}
            align="start"
            className="z-[9999] w-[min(92vw,390px)] max-h-[70vh] overflow-y-auto rounded-[30px] border border-white/75 bg-[#fbfaf7]/96 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.16)] backdrop-blur-2xl outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
          >
            <div className="mb-4">
              <div className="text-[24px] font-[300] leading-tight tracking-[-0.04em] text-[#111]">
                {t.timePopoverTitle}
              </div>

              <p className="mt-1 text-[13px] leading-6 text-black/54">
                {t.timePopoverText}
              </p>
            </div>

            <div className="space-y-4">
              <SlotGroup
                title={t.morning}
                slots={TIME_GROUPS.morning}
                value={value}
                onChange={handleSelect}
              />

              <SlotGroup
                title={t.afternoon}
                slots={TIME_GROUPS.afternoon}
                value={value}
                onChange={handleSelect}
              />

              <SlotGroup
                title={t.evening}
                slots={TIME_GROUPS.evening}
                value={value}
                onChange={handleSelect}
              />
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}

type ProgressField = {
  key: string;
  label: string;
  done: boolean;
};

function BookingProgress({
  fields,
  percent,
  label,
  doneLabel,
}: {
  fields: ProgressField[];
  percent: number;
  label: string;
  doneLabel: string;
}) {
  const isComplete = percent >= 100;

  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
          {isComplete ? doneLabel : label}
        </span>

        <span className="text-[11px] font-semibold tabular-nums text-[#927140]">
          {Math.round(percent)}%
        </span>
      </div>

      <div className="relative h-[6px] w-full overflow-hidden rounded-full bg-black/[0.06]">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#b08b57] via-[#d9c7a2] to-[#b08b57]"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-[1px]">
          {[20, 40, 60, 80].map((mark) => (
            <span
              key={mark}
              className="h-[6px] w-[2px] bg-[#f8f6f1]"
              style={{ marginLeft: `${mark}%` }}
            />
          ))}
        </div>
      </div>

      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5">
        {fields.map((field) => (
          <span
            key={field.key}
            className={`flex items-center gap-1.5 text-[10px] font-medium tracking-[0.04em] transition-colors duration-300 ${
              field.done ? "text-black/58" : "text-black/28"
            }`}
          >
            <span
              className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border transition-all duration-300 ${
                field.done
                  ? "border-[#b08b57] bg-[#b08b57] text-white"
                  : "border-black/16 bg-transparent"
              }`}
            >
              {field.done ? <Check className="h-2 w-2" strokeWidth={3} /> : null}
            </span>
            {field.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function pad2(value: number) {
  return String(value).padStart(2, "0");
}

function downloadBookingIcs(booking: ConfirmedBooking) {
  const [hoursStr, minutesStr] = booking.time.split(":");
  const start = new Date(booking.date);
  start.setHours(Number(hoursStr) || 0, Number(minutesStr) || 0, 0, 0);

  const end = new Date(start);
  end.setMinutes(end.getMinutes() + 60);

  const toIcsStamp = (d: Date) =>
    `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}T${pad2(
      d.getHours()
    )}${pad2(d.getMinutes())}00`;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BeSmile Dental Clinic//Booking//RU",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@besmile.az`,
    `DTSTAMP:${toIcsStamp(new Date())}`,
    `DTSTART:${toIcsStamp(start)}`,
    `DTEND:${toIcsStamp(end)}`,
    "SUMMARY:BeSmile Dental Clinic — приём",
    "LOCATION:24 Khan Shushinski\\, Baku",
    `DESCRIPTION:Запись на приём для ${booking.name.replace(/,/g, "\\,")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "besmile-booking.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function BookingSuccess({
  lang,
  t,
  booking,
  onReset,
}: {
  lang: Lang;
  t: Content;
  booking: ConfirmedBooking;
  onReset: () => void;
}) {
  const particles = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => {
        const angle = (i / 10) * Math.PI * 2;
        return {
          id: i,
          x: Math.cos(angle) * 78,
          y: Math.sin(angle) * 78,
          delay: 0.55 + i * 0.03,
        };
      }),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-h-[560px] flex-col items-center justify-center px-2 py-6 text-center sm:min-h-[600px]"
    >
      <div className="relative flex h-[168px] w-[168px] items-center justify-center">
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute h-[6px] w-[6px] rounded-full bg-gradient-to-br from-[#d9c7a2] to-[#b08b57]"
            initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              x: p.x,
              y: p.y,
              scale: [0, 1, 0.4],
            }}
            transition={{
              duration: 0.9,
              delay: p.delay,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}

        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.6,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          className="absolute inset-0 rounded-full border border-[#d9c7a2]/40 bg-[radial-gradient(circle_at_center,rgba(217,199,162,0.16),transparent_70%)]"
        />

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative flex h-[108px] w-[108px] items-center justify-center rounded-full bg-[#111111] shadow-[0_20px_60px_rgba(17,17,17,0.28)]"
        >
          <svg
            width="46"
            height="46"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#d9c7a2]"
          >
            <motion.path
              d="M5 12.5L10 17.5L19 7"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.55, delay: 0.35, ease: "easeOut" }}
            />
          </svg>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.5 }}
        className="mt-6 inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/74 px-4 py-2 shadow-[0_10px_34px_rgba(0,0,0,0.04)] backdrop-blur-md"
      >
        <Sparkles className="h-3 w-3 text-[#927140]" />
        <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-black/46">
          {t.successBadge}
        </span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.58 }}
        className="mt-4 text-[38px] font-[300] leading-[0.98] tracking-[-0.045em] text-[#111111] sm:text-[46px]"
      >
        {t.successTitle}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.65 }}
        className="mt-3 max-w-[380px] text-[14px] leading-6 text-black/56"
      >
        {t.successText}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.72 }}
        className="mt-6 flex w-full max-w-[420px] flex-col gap-3 rounded-[26px] border border-white/75 bg-white/78 p-2 shadow-[0_16px_46px_rgba(0,0,0,0.05)] backdrop-blur-xl sm:flex-row"
      >
        <div className="flex flex-1 items-center gap-3 rounded-[20px] px-4 py-3 text-left">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d8ccb7] bg-[#f5eee0] text-[#927140]">
            <CalendarDays className="h-[15px] w-[15px]" strokeWidth={1.7} />
          </span>
          <span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-black/34">
              {t.successDate}
            </span>
            <span className="mt-0.5 block text-[14px] text-[#111]">
              {formatDateValue(booking.date, lang)}
            </span>
          </span>
        </div>

        <div className="hidden w-px self-stretch bg-black/6 sm:block" />

        <div className="flex flex-1 items-center gap-3 rounded-[20px] px-4 py-3 text-left">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d8ccb7] bg-[#f5eee0] text-[#927140]">
            <Clock3 className="h-[15px] w-[15px]" strokeWidth={1.7} />
          </span>
          <span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-black/34">
              {t.successTime}
            </span>
            <span className="mt-0.5 block text-[14px] text-[#111]">
              {booking.time}
            </span>
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-5 flex w-full max-w-[420px] flex-col gap-3 sm:flex-row"
      >
        <button
          type="button"
          onClick={() => downloadBookingIcs(booking)}
          className="group inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full bg-[#111] px-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_16px_38px_rgba(0,0,0,0.16)] transition duration-300 hover:-translate-y-[1px] hover:shadow-[0_20px_48px_rgba(0,0,0,0.22)]"
        >
          <CalendarPlus className="h-4 w-4" strokeWidth={1.8} />
          <span>{t.successAddToCalendar}</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full border border-black/10 bg-white/76 px-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/56 backdrop-blur-md transition duration-300 hover:-translate-y-[1px] hover:bg-white"
        >
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.8} />
          <span>{t.successBookAnother}</span>
        </button>
      </motion.div>

      <motion.a
        href="tel:+994704210204"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="mt-5 inline-flex items-center gap-2 text-[12px] leading-6 text-black/46 transition hover:text-black/70"
      >
        <Phone className="h-3.5 w-3.5 text-[#927140]" />
        <span>{t.successCallUs} — +994 70 421 02 04</span>
      </motion.a>
    </motion.div>
  );
}

function BookOnlinePageInner({ lang }: { lang: Lang }) {
  const t = CONTENT[lang];
  const [formData, setFormData] = useState<FormDataState>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({
    type: null,
    message: "",
  });
  const [confirmedBooking, setConfirmedBooking] =
    useState<ConfirmedBooking | null>(null);

  // Страница всегда открывается сверху
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  // Сообщение из аккордиона (query-параметр "message") подставляется в форму
  const applyMessageParam = useCallback((paramMessage: string) => {
    setFormData((prev) => ({ ...prev, message: paramMessage }));
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const progressFields = useMemo<ProgressField[]>(
    () => [
      { key: "name", label: t.name, done: formData.name.trim().length > 1 },
      { key: "phone", label: t.phone, done: formData.phone.trim().length > 5 },
      { key: "date", label: t.date, done: Boolean(formData.date) },
      { key: "time", label: t.time, done: Boolean(formData.time) },
      {
        key: "message",
        label: t.message,
        done: formData.message.trim().length > 1,
      },
    ],
    [formData, t]
  );

  const progressPercent = useMemo(() => {
    const done = progressFields.filter((field) => field.done).length;
    return (done / progressFields.length) * 100;
  }, [progressFields]);

  const formattedEmailDate = useMemo(() => {
    if (!formData.date) return "";
    return format(formData.date, "yyyy-MM-dd");
  }, [formData.date]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitStatus({ type: null, message: "" });

    if (!formData.date || !formData.time) {
      setSubmitStatus({
        type: "error",
        message: t.scheduleRequired,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/send-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          date: formattedEmailDate,
          time: formData.time,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("[v0] Booking error:", errorData);
        throw new Error(errorData.error || "Failed to send booking");
      }

      console.log("[v0] Booking sent successfully");
      setConfirmedBooking({
        name: formData.name,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
      });
      setSubmitStatus({
        type: "success",
        message: t.success,
      });

      setFormData(INITIAL_FORM);
    } catch (error) {
      console.error("[v0] Error submitting booking:", error);
      setSubmitStatus({
        type: "error",
        message: t.error,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setConfirmedBooking(null);
    setSubmitStatus({ type: null, message: "" });
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f8f6f1] font-manrope text-[#111111]">
      <SearchParamWatcher name="message" onValue={applyMessageParam} />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#fbfaf7_0%,#f8f6f1_42%,#f0eadf_100%)]" />
        <div className="absolute left-[-14%] top-[-18%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.66),transparent)] scale-[1.6]" />
        <div className="absolute right-[-12%] top-[10%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(227,208,173,0.21),transparent)] scale-[1.6]" />
        <div className="absolute bottom-[-12%] left-[24%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.525),transparent)] scale-[1.6]" />
        <div className="absolute inset-0 opacity-[0.045] [background-image:linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] [background-size:92px_92px]" />
      </div>

      <div className="relative mx-auto max-w-[1580px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12 xl:px-12">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <motion.aside
            {...fadeUp(0)}
            className="relative hidden overflow-hidden rounded-[32px] border border-white/70 bg-[#111111] p-2 shadow-[0_26px_92px_rgba(0,0,0,0.14)] backdrop-blur-xl lg:block"
          >
            <div className="relative flex h-full min-h-[640px] flex-col overflow-hidden rounded-[26px] px-7 py-7">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,#111111_0%,#181714_48%,#0f0f0f_100%)]" />
                <div className="absolute left-[-18%] top-[-12%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(217,199,162,0.09),transparent)] scale-[1.6]" />
                <div className="absolute bottom-[-16%] right-[-16%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(closest-side,rgba(176,139,87,0.12),transparent)] scale-[1.6]" />
                <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:88px_88px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.10),transparent_28%),radial-gradient(circle_at_82%_20%,rgba(217,199,162,0.20),transparent_26%)]" />
              </div>

              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between rounded-full border border-white/12 bg-white/[0.06] px-5 py-3 backdrop-blur-xl">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/82">
                      BESMILE
                    </span>

                    <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/52">
                      BAKU
                    </span>
                  </div>

                  <div className="mt-10">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.07] px-4 py-2 backdrop-blur-xl">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#d9c7a2]" />
                      <span className="text-[10px] uppercase tracking-[0.24em] text-white/58">
                        {t.sideLabel}
                      </span>
                    </div>

                    <h2 className="mt-6 max-w-[440px] text-[46px] font-[300] leading-[0.96] tracking-[-0.055em] text-white xl:text-[54px]">
                      <span className="block">{t.sideTitleTop}</span>
                      <span className="block">{t.sideTitleBottom}</span>
                    </h2>

                    <p className="mt-5 max-w-[400px] text-[15px] leading-7 text-white/54">
                      {t.sideText}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="grid gap-2.5">
                    {[t.step1, t.step2, t.step3].map((item, index) => {
                      const isDateStep = index === 0;
                      const isTimeStep = index === 1;
                      const isConfirmStep = index === 2;

                      const active =
                        (isDateStep && Boolean(formData.date)) ||
                        (isTimeStep && Boolean(formData.time)) ||
                        (isConfirmStep && submitStatus.type === "success");

                      return (
                        <div
                          key={item}
                          className={`rounded-[20px] border px-5 py-3.5 backdrop-blur-xl transition-all duration-300 ${
                            active
                              ? "border-[#d9c7a2]/45 bg-white/[0.11]"
                              : "border-white/12 bg-white/[0.06]"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-5">
                            <div>
                              <div
                                className={`text-[11px] transition-colors duration-300 ${
                                  active ? "text-[#d9c7a2]/70" : "text-white/30"
                                }`}
                              >
                                {String(index + 1).padStart(2, "0")}
                              </div>

                              <div
                                className={`mt-1 text-[12px] font-semibold uppercase leading-[1.45] tracking-[0.18em] transition-colors duration-300 ${
                                  active ? "text-white/92" : "text-white/66"
                                }`}
                              >
                                {item}
                              </div>
                            </div>

                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 ${
                                active
                                  ? "border-[#d9c7a2]/50 bg-[#d9c7a2]/20 text-[#f1e6ce]"
                                  : "border-white/12 bg-white/[0.06] text-white/46"
                              }`}
                            >
                              <Check className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 rounded-[26px] border border-white/14 bg-white/[0.08] p-5 backdrop-blur-2xl">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/38">
                      BeSmile Dental Clinic
                    </div>

                    <div className="mt-4 grid gap-3.5">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.22em] text-white/30">
                          {t.addressLabel}
                        </div>
                        <div className="mt-1 text-[14px] text-white/68">
                          24 Khan Shushinski, Baku
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] uppercase tracking-[0.22em] text-white/30">
                          {t.phoneLabel}
                        </div>

                        <a
                          href="tel:+994704210204"
                          className="mt-1 inline-flex text-[14px] text-white/76 transition hover:text-white"
                        >
                          +994 70 421 02 04
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>

          <div className="flex items-center">
            <motion.div
              {...fadeUp(0.08)}
              className="relative w-full overflow-hidden rounded-[32px] border border-white/75 bg-white/62 p-5 shadow-[0_26px_92px_rgba(0,0,0,0.075)] backdrop-blur-2xl sm:p-6 lg:p-7 xl:p-8"
            >
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -right-20 -top-20 h-[220px] w-[220px] rounded-full bg-[#d9c7a2]/26 blur-3xl" />
                <div className="absolute bottom-[-80px] left-[18%] h-[190px] w-[190px] rounded-full bg-white/80 blur-3xl" />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.72),rgba(255,255,255,0.28))]" />
              </div>

              <div className="relative z-10">
              <AnimatePresence mode="wait">
                {confirmedBooking ? (
                  <BookingSuccess
                    key="success"
                    lang={lang}
                    t={t}
                    booking={confirmedBooking}
                    onReset={handleReset}
                  />
                ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="mb-3 inline-flex items-center gap-3 rounded-full border border-black/8 bg-white/74 px-4 py-2 shadow-[0_10px_34px_rgba(0,0,0,0.04)] backdrop-blur-md">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#b08b57]" />
                      <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-black/46">
                        {t.badge}
                      </span>
                    </div>

                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.34em] text-black/38">
                      {t.eyebrow}
                    </p>

                    <h1 className="max-w-[680px] text-[38px] font-[300] leading-[0.96] tracking-[-0.05em] text-[#111111] sm:text-[48px] lg:text-[56px] xl:text-[62px]">
                      <span className="block">{t.titleTop}</span>
                      <span className="block text-black/78">
                        {t.titleBottom}
                      </span>
                    </h1>

                    <p className="mt-3 max-w-[560px] text-[14px] leading-7 text-black/60 sm:text-[15px]">
                      {t.description}
                    </p>
                  </div>

                  <Link
                    href={`/${lang}`}
                    className="group inline-flex w-fit items-center gap-3 rounded-full border border-black/8 bg-white/76 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-black/48 shadow-[0_10px_28px_rgba(0,0,0,0.035)] transition duration-300 hover:-translate-y-[1px] hover:bg-white hover:text-black/70"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-0.5" />
                    {t.back}
                  </Link>
                </div>

                <BookingProgress
                  fields={progressFields}
                  percent={progressPercent}
                  label={t.progressLabel}
                  doneLabel={t.progressDone}
                />

                <form onSubmit={handleSubmit} className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <FieldLabel>{t.name}</FieldLabel>
                      <InputShell>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          required
                          placeholder={t.namePlaceholder}
                          className="h-8 w-full border-none bg-transparent text-[15px] text-[#111] outline-none placeholder:text-black/30"
                        />
                      </InputShell>
                    </div>

                    <div>
                      <FieldLabel>{t.phone}</FieldLabel>
                      <InputShell>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          required
                          placeholder={t.phonePlaceholder}
                          className="h-8 w-full border-none bg-transparent text-[15px] text-[#111] outline-none placeholder:text-black/30"
                        />
                      </InputShell>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <PremiumDatePicker
                      lang={lang}
                      t={t}
                      value={formData.date}
                      onChange={(date) =>
                        setFormData((prev) => ({ ...prev, date }))
                      }
                    />

                    <PremiumTimePicker
                      t={t}
                      value={formData.time}
                      onChange={(time) =>
                        setFormData((prev) => ({ ...prev, time }))
                      }
                    />
                  </div>

                  <div>
                    <FieldLabel>{t.message}</FieldLabel>
                    <div className="rounded-[24px] border border-white/75 bg-white/78 px-4 py-3.5 shadow-[0_16px_50px_rgba(0,0,0,0.05)] backdrop-blur-xl transition duration-300 focus-within:border-[#b08b57]/35 focus-within:bg-white/90">
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            message: e.target.value,
                          }))
                        }
                        required
                        placeholder={t.messagePlaceholder}
                        className="min-h-[88px] w-full resize-none border-none bg-transparent text-[15px] leading-7 text-[#111] outline-none placeholder:text-black/30"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group inline-flex min-h-[54px] w-full items-center justify-center gap-3 rounded-full bg-[#111] px-7 text-[11px] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_16px_38px_rgba(0,0,0,0.16)] transition duration-300 hover:-translate-y-[1px] hover:shadow-[0_20px_48px_rgba(0,0,0,0.22)] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-[270px]"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : null}

                      <span>{isSubmitting ? t.submitting : t.submit}</span>

                      {!isSubmitting ? (
                        <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
                      ) : null}
                    </button>

                    <div className="flex items-center gap-2 text-[12px] leading-6 text-black/46">
                      <Phone className="h-3.5 w-3.5 text-[#927140]" />
                      <span>{t.note}</span>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {submitStatus.type && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25 }}
                        className={`rounded-[18px] border px-4 py-3 text-sm ${
                          submitStatus.type === "success"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                            : "border-red-200 bg-red-50 text-red-700"
                        }`}
                      >
                        {submitStatus.message}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>

                <div className="mt-5 grid gap-3 border-t border-black/6 pt-4 sm:grid-cols-3">
                  {[t.benefit1, t.benefit2, t.benefit3].map((item, index) => {
                    const Icon = index === 0 ? ShieldCheck : Check;

                    return (
                      <div
                        key={item}
                        className="rounded-[16px] border border-white/72 bg-white/56 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/44 shadow-[0_10px_30px_rgba(0,0,0,0.03)] backdrop-blur-xl"
                      >
                        <div className="flex items-center gap-2">
                          <Icon
                            className="h-3.5 w-3.5 text-[#927140]"
                            strokeWidth={1.8}
                          />
                          <span>{item}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 rounded-[22px] border border-white/72 bg-white/50 p-4 backdrop-blur-xl">
                  <h2 className="text-[17px] font-[300] tracking-[-0.03em] text-[#111]">
                    {t.microTitle}
                  </h2>

                  <p className="mt-1.5 max-w-[640px] text-[13px] leading-6 text-black/58">
                    {t.microText}
                  </p>
                </div>
                </motion.div>
                )}
              </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .booking-calendar-premium .rdp {
          --rdp-accent-color: #111111;
          --rdp-background-color: rgba(17, 17, 17, 0.06);
          margin: 0;
        }

        .booking-calendar-premium .rdp-months {
          justify-content: center;
        }

        .booking-calendar-premium .rdp-month {
          width: 100%;
        }

        .booking-calendar-premium .rdp-caption {
          padding: 0 4px 14px;
        }

        .booking-calendar-premium .rdp-caption_label {
          font-size: 13px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(17, 17, 17, 0.72);
          font-weight: 600;
        }

        .booking-calendar-premium .rdp-nav {
          gap: 6px;
        }

        .booking-calendar-premium .rdp-nav_button {
          width: 36px;
          height: 36px;
          border-radius: 9999px;
          border: 1px solid rgba(17, 17, 17, 0.08);
          background: rgba(255, 255, 255, 0.82);
          color: rgba(17, 17, 17, 0.56);
          transition: all 0.25s ease;
        }

        .booking-calendar-premium .rdp-nav_button:hover {
          background: #f5eee0;
          color: rgba(17, 17, 17, 0.78);
        }

        .booking-calendar-premium .rdp-head_cell {
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(17, 17, 17, 0.32);
          font-weight: 600;
          padding-bottom: 8px;
        }

        .booking-calendar-premium .rdp-cell {
          padding: 3px;
        }

        .booking-calendar-premium .rdp-day {
          width: 42px;
          height: 42px;
          font-size: 14px;
          border-radius: 9999px;
          color: rgba(17, 17, 17, 0.82);
          transition: all 0.25s ease;
        }

        .booking-calendar-premium .rdp-day:hover {
          background: rgba(17, 17, 17, 0.06);
        }

        .booking-calendar-premium .rdp-day_selected {
          background: #111111 !important;
          color: white !important;
          box-shadow: 0 10px 24px rgba(17, 17, 17, 0.18);
        }

        .booking-calendar-premium .rdp-day_today {
          border: 1px solid rgba(146, 113, 64, 0.42);
        }

        .booking-calendar-premium .rdp-day_outside {
          color: rgba(17, 17, 17, 0.22);
        }

        .booking-calendar-premium .rdp-day_disabled {
          color: rgba(17, 17, 17, 0.18);
        }

        .booking-calendar-premium .rdp-button_reset:focus-visible,
        .booking-calendar-premium .rdp-day:focus-visible {
          outline: 2px solid rgba(146, 113, 64, 0.32);
          outline-offset: 2px;
        }
      `}</style>
    </section>
  );
}

export default function BookOnlinePageClient({ lang }: { lang: Lang }) {
  return (
    <Suspense fallback={null}>
      <BookOnlinePageInner lang={lang} />
    </Suspense>
  );
}