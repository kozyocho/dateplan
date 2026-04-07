'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { type PlanConditions, type Genre, type Transport } from '@/types'

const schema = z.object({
  area: z.enum(['nagoya', 'tokyo']),
  location: z.string().min(1, '出発地点を入力してください'),
  people_count: z.number().min(1).max(5),
  age_group: z.enum(['teens', 'twenties', 'thirties', 'forties_plus']),
  gender_combo: z.enum(['male_female', 'male_male', 'female_female', 'mixed']),
  relationship: z.enum(['first_date', 'new_couple', 'couple', 'married', 'friends', 'family']),
  scene: z.enum(['anniversary', 'casual', 'surprise', 'first_date', 'holiday']),
  time_start: z.string().min(1),
  duration_hours: z.number(),
  transport: z.array(z.enum(['train', 'taxi', 'car', 'walk'])).min(1, '移動手段を選択してください'),
  weather: z.enum(['sunny', 'cloudy', 'rainy', 'any']),
  budget_per_person: z.number(),
  genre_preferences: z.array(z.string()),
  genre_ng: z.array(z.string()),
})

interface ConditionFormProps {
  onSubmit: (conditions: PlanConditions) => void
  isLoading?: boolean
}

const GENRES: { value: Genre; label: string }[] = [
  { value: 'gourmet', label: 'グルメ' },
  { value: 'cafe', label: 'カフェ' },
  { value: 'nature', label: '自然・公園' },
  { value: 'art', label: 'アート・美術館' },
  { value: 'shopping', label: 'ショッピング' },
  { value: 'activity', label: 'アクティビティ' },
  { value: 'movie', label: '映画' },
  { value: 'amusement', label: '遊園地' },
  { value: 'sightseeing', label: '観光・歴史' },
  { value: 'night_view', label: '夜景' },
]

const TRANSPORTS: { value: Transport; label: string }[] = [
  { value: 'train', label: '電車・地下鉄' },
  { value: 'car', label: '車' },
  { value: 'taxi', label: 'タクシー' },
  { value: 'walk', label: '徒歩' },
]

const STEPS_META = [
  { label: 'エリア' },
  { label: '関係性' },
  { label: '時間・予算' },
  { label: 'ジャンル' },
]

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-between mb-6">
      {STEPS_META.map((s, i) => {
        const idx = i + 1
        const isCompleted = idx < current
        const isActive = idx === current
        return (
          <div key={i} className="flex-1 flex flex-col items-center relative">
            {i < total - 1 && (
              <div className={`absolute top-3.5 left-1/2 w-full h-px transition-colors ${isCompleted ? 'bg-[#ff385c]' : 'bg-[#c1c1c1]/40'}`} />
            )}
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-all ${
              isCompleted ? 'bg-[#ff385c] text-white' :
              isActive ? 'bg-white text-[#ff385c] ring-2 ring-[#ff385c]/40 shadow-sm' :
              'bg-[#f2f2f2] text-[#929292] border border-[#c1c1c1]/40'
            }`}>
              {isCompleted ? '✓' : idx}
            </div>
            <span className={`text-xs mt-1.5 text-center leading-tight ${isActive ? 'text-[#222222] font-medium' : 'text-[#929292]'}`}>
              {s.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function OptionBtn({
  selected, onClick, children, className,
}: { selected: boolean; onClick: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'px-3 py-2 rounded-[8px] text-sm border transition-all',
        selected
          ? 'bg-[#ff385c] text-white border-[#ff385c] shadow-sm font-medium'
          : 'bg-white text-[#222222] border-[#c1c1c1] hover:border-[#222222]',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

const labelClass = 'text-sm font-medium text-[#222222] mb-2 block'

export function ConditionForm({ onSubmit, isLoading }: ConditionFormProps) {
  const [step, setStep] = useState(1)

  const { register, watch, setValue, getValues, formState: { errors } } = useForm<PlanConditions>({
    resolver: zodResolver(schema),
    defaultValues: {
      area: 'nagoya',
      people_count: 2,
      age_group: 'twenties',
      gender_combo: 'male_female',
      relationship: 'couple',
      scene: 'casual',
      time_start: '11:00',
      duration_hours: 6,
      transport: ['train'],
      weather: 'any',
      budget_per_person: 5000,
      genre_preferences: [],
      genre_ng: [],
    },
  })

  const area = watch('area')
  const peopleCount = watch('people_count')
  const ageGroup = watch('age_group')
  const relationship = watch('relationship')
  const scene = watch('scene')
  const durationHours = watch('duration_hours')
  const transport = watch('transport')
  const weather = watch('weather')
  const budget = watch('budget_per_person')
  const genrePrefs = watch('genre_preferences')
  const genreNG = watch('genre_ng')

  const toggleTransport = (value: Transport) => {
    const current = transport ?? []
    setValue('transport', current.includes(value) ? current.filter(t => t !== value) : [...current, value])
  }

  const toggleGenre = (value: Genre, field: 'genre_preferences' | 'genre_ng') => {
    const current = field === 'genre_preferences' ? (genrePrefs ?? []) : (genreNG ?? [])
    setValue(field, current.includes(value) ? current.filter(g => g !== value) : [...current, value])
  }

  const goNext = () => { setStep(s => s + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const goBack = () => { setStep(s => s - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const cardClass = 'bg-white rounded-[14px] border border-[#c1c1c1]/40 shadow-sm overflow-hidden'

  return (
    <form onSubmit={e => e.preventDefault()} className="space-y-5">
      <StepIndicator current={step} total={4} />

      {step === 1 && (
        <div className={cardClass}>
          <div className="px-5 pt-5 pb-1">
            <p className="text-xs font-bold text-[#ff385c] uppercase tracking-wide">Step 1</p>
            <h3 className="text-base font-bold text-[#222222]">エリア・場所・人数</h3>
          </div>
          <div className="px-5 pb-5 pt-4 space-y-5">
            <div>
              <label className={labelClass}>エリア</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'nagoya', label: '名古屋', sub: '栄・名駅・大須' },
                  { value: 'tokyo', label: '東京', sub: '渋谷・新宿・表参道' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setValue('area', opt.value as 'nagoya' | 'tokyo')}
                    className={`p-4 rounded-[8px] border text-left transition-all ${
                      area === opt.value
                        ? 'border-[#ff385c] bg-[#fff0f2]'
                        : 'border-[#c1c1c1] bg-white hover:border-[#222222]'
                    }`}
                  >
                    <p className={`font-bold text-sm ${area === opt.value ? 'text-[#ff385c]' : 'text-[#222222]'}`}>{opt.label}</p>
                    <p className="text-xs text-[#929292] mt-0.5">{opt.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>出発地点・希望エリア</label>
              <Input
                placeholder={area === 'nagoya' ? '例: 名古屋駅、栄、大須' : '例: 渋谷駅、表参道、新宿'}
                {...register('location')}
                className="border-[#c1c1c1] rounded-[8px] h-11"
              />
              {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location.message}</p>}
            </div>

            <div>
              <label className={labelClass}>人数</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <OptionBtn key={n} selected={peopleCount === n} onClick={() => setValue('people_count', n)} className="flex-1">
                    {n}人
                  </OptionBtn>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className={cardClass}>
          <div className="px-5 pt-5 pb-1">
            <p className="text-xs font-bold text-[#ff385c] uppercase tracking-wide">Step 2</p>
            <h3 className="text-base font-bold text-[#222222]">関係性・シーン</h3>
          </div>
          <div className="px-5 pb-5 pt-4 space-y-5">
            <div>
              <label className={labelClass}>関係性</label>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { value: 'first_date', label: '初めてのデート' },
                  { value: 'new_couple', label: '付き合いたて' },
                  { value: 'couple', label: 'カップル' },
                  { value: 'married', label: '夫婦・パートナー' },
                  { value: 'friends', label: '友達' },
                  { value: 'family', label: '家族' },
                ] as { value: PlanConditions['relationship']; label: string }[]).map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setValue('relationship', opt.value)}
                    className={`p-3 rounded-[8px] border text-left transition-all ${
                      relationship === opt.value
                        ? 'border-[#ff385c] bg-[#fff0f2]'
                        : 'border-[#c1c1c1] bg-white hover:border-[#222222]'
                    }`}
                  >
                    <span className={`text-sm font-medium ${relationship === opt.value ? 'text-[#ff385c]' : 'text-[#222222]'}`}>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>シーン</label>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { value: 'casual', label: '普通の休日' },
                  { value: 'first_date', label: '初デート' },
                  { value: 'anniversary', label: '記念日' },
                  { value: 'surprise', label: 'サプライズ' },
                  { value: 'holiday', label: '祝日・特別な日' },
                ] as { value: PlanConditions['scene']; label: string }[]).map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setValue('scene', opt.value)}
                    className={`p-3 rounded-[8px] border text-left transition-all ${
                      scene === opt.value
                        ? 'border-[#ff385c] bg-[#fff0f2]'
                        : 'border-[#c1c1c1] bg-white hover:border-[#222222]'
                    }`}
                  >
                    <span className={`text-sm font-medium ${scene === opt.value ? 'text-[#ff385c]' : 'text-[#222222]'}`}>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>年齢層</label>
              <div className="flex flex-wrap gap-2">
                {([
                  { value: 'teens', label: '10代' },
                  { value: 'twenties', label: '20代' },
                  { value: 'thirties', label: '30代' },
                  { value: 'forties_plus', label: '40代以上' },
                ] as { value: PlanConditions['age_group']; label: string }[]).map(opt => (
                  <OptionBtn key={opt.value} selected={ageGroup === opt.value} onClick={() => setValue('age_group', opt.value)}>
                    {opt.label}
                  </OptionBtn>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className={cardClass}>
          <div className="px-5 pt-5 pb-1">
            <p className="text-xs font-bold text-[#ff385c] uppercase tracking-wide">Step 3</p>
            <h3 className="text-base font-bold text-[#222222]">時間・移動・予算</h3>
          </div>
          <div className="px-5 pb-5 pt-4 space-y-5">
            <div>
              <label className={labelClass}>開始時間</label>
              <Input type="time" {...register('time_start')} className="border-[#c1c1c1] rounded-[8px] h-11 w-full" />
            </div>

            <div>
              <label className={labelClass}>所要時間</label>
              <div className="flex flex-wrap gap-2">
                {[3, 4, 5, 6, 8, 10].map(h => (
                  <OptionBtn key={h} selected={durationHours === h} onClick={() => setValue('duration_hours', h)}>
                    {h}時間
                  </OptionBtn>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>移動手段（複数選択可）</label>
              <div className="flex flex-wrap gap-2">
                {TRANSPORTS.map(t => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => toggleTransport(t.value)}
                    className={`px-3 py-2 rounded-[8px] text-sm border transition-all ${
                      transport?.includes(t.value)
                        ? 'bg-[#ff385c] text-white border-[#ff385c] shadow-sm font-medium'
                        : 'bg-white text-[#222222] border-[#c1c1c1] hover:border-[#222222]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              {errors.transport && <p className="text-xs text-red-500 mt-1">{errors.transport.message}</p>}
            </div>

            <div>
              <label className={labelClass}>天候</label>
              <div className="grid grid-cols-4 gap-2">
                {([
                  { value: 'any', label: 'なんでも' },
                  { value: 'sunny', label: '晴れ' },
                  { value: 'cloudy', label: '曇り' },
                  { value: 'rainy', label: '雨' },
                ] as { value: PlanConditions['weather']; label: string }[]).map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setValue('weather', opt.value)}
                    className={`p-3 rounded-[8px] border transition-all text-center ${
                      weather === opt.value
                        ? 'border-[#ff385c] bg-[#fff0f2]'
                        : 'border-[#c1c1c1] bg-white hover:border-[#222222]'
                    }`}
                  >
                    <span className={`text-xs font-medium ${weather === opt.value ? 'text-[#ff385c]' : 'text-[#222222]'}`}>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>予算（一人あたり）</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 1000, label: '〜1,000円' },
                  { value: 3000, label: '〜3,000円' },
                  { value: 5000, label: '〜5,000円' },
                  { value: 10000, label: '〜10,000円' },
                  { value: 20000, label: '〜20,000円' },
                  { value: 30000, label: '〜30,000円' },
                ].map(opt => (
                  <OptionBtn key={opt.value} selected={budget === opt.value} onClick={() => setValue('budget_per_person', opt.value)}>
                    {opt.label}
                  </OptionBtn>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className={cardClass}>
          <div className="px-5 pt-5 pb-1">
            <p className="text-xs font-bold text-[#ff385c] uppercase tracking-wide">Step 4</p>
            <h3 className="text-base font-bold text-[#222222]">
              好みジャンル <span className="text-[#929292] text-sm font-normal">（任意）</span>
            </h3>
          </div>
          <div className="px-5 pb-5 pt-4 space-y-5">
            <div>
              <label className={labelClass}>行きたいジャンル</label>
              <div className="flex flex-wrap gap-2">
                {GENRES.map(g => (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => toggleGenre(g.value, 'genre_preferences')}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                      genrePrefs?.includes(g.value)
                        ? 'bg-[#ff385c] text-white border-[#ff385c] shadow-sm'
                        : 'bg-white text-[#222222] border-[#c1c1c1] hover:border-[#222222]'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>NGジャンル</label>
              <div className="flex flex-wrap gap-2">
                {GENRES.map(g => (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => toggleGenre(g.value, 'genre_ng')}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                      genreNG?.includes(g.value)
                        ? 'bg-red-500 text-white border-red-500 shadow-sm'
                        : 'bg-white text-[#222222] border-[#c1c1c1] hover:border-[#222222]'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-1">
        {step > 1 && (
          <button
            type="button"
            onClick={goBack}
            className="flex-1 h-11 rounded-[8px] border border-[#c1c1c1] text-[#222222] text-sm font-medium hover:bg-[#f2f2f2] transition-all"
          >
            戻る
          </button>
        )}
        {step < 4 ? (
          <button
            type="button"
            onClick={goNext}
            className="flex-1 h-11 rounded-[8px] text-white text-sm font-bold transition-all bg-[#ff385c] hover:bg-[#e00b41]"
          >
            次へ
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onSubmit(getValues() as PlanConditions)}
            disabled={isLoading}
            className="flex-1 h-12 rounded-[8px] text-white text-sm font-bold transition-all disabled:opacity-60 bg-[#ff385c] hover:bg-[#e00b41]"
          >
            {isLoading ? 'AIがプランを生成中...' : 'このプランで生成する'}
          </button>
        )}
      </div>
    </form>
  )
}
