// ==========================================
// デートプラン条件
// ==========================================

export type Area = 'nagoya' | 'tokyo'

export type PeopleCount = number

export type AgeGroup = 'teens' | 'twenties' | 'thirties' | 'forties_plus'

export type GenderCombo =
  | 'male_female'
  | 'male_male'
  | 'female_female'
  | 'mixed'

export type Relationship =
  | 'first_date'
  | 'new_couple'
  | 'couple'
  | 'married'
  | 'friends'
  | 'family'

export type Scene =
  | 'anniversary'
  | 'casual'
  | 'surprise'
  | 'first_date'
  | 'holiday'

export type Transport = 'train' | 'taxi' | 'car' | 'walk'

export type Weather = 'sunny' | 'cloudy' | 'rainy' | 'any'

export type BudgetPerPerson = number

export type Genre =
  | 'gourmet'
  | 'cafe'
  | 'nature'
  | 'art'
  | 'shopping'
  | 'activity'
  | 'movie'
  | 'amusement'
  | 'sightseeing'
  | 'night_view'

export interface PlanConditions {
  area: Area
  location: string
  people_count: PeopleCount
  age_group: AgeGroup
  gender_combo: GenderCombo
  relationship: Relationship
  scene: Scene
  time_start: string // "10:00", "14:00" etc
  duration_hours: number
  transport: Transport[]
  weather: Weather
  budget_per_person: number
  genre_preferences: string[]
  genre_ng: string[]
}

// ==========================================
// AI生成結果
// ==========================================

export interface PlanSpot {
  time: string
  duration: string
  place: string
  category: string
  description: string
  transport_to_next: string
  estimated_cost: number
}

export interface GeneratedPlan {
  title: string
  summary: string
  timeline: PlanSpot[]
  total_estimated_cost: number
  tips: string[]
}

// ==========================================
// DB モデル
// ==========================================

export interface Profile {
  id: string
  email: string | null
  plan_count: number
  plan_reset_at: string
  is_pro: boolean
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  created_at: string
}

export interface DatePlan {
  id: string
  user_id: string
  title: string
  conditions: PlanConditions
  plan_content: string // JSON string of GeneratedPlan
  area: Area
  created_at: string
}

// ==========================================
// API レスポンス
// ==========================================

export interface ApiError {
  error: string
  code?: string
}

export interface UsageStatus {
  allowed: boolean
  remaining?: number
  is_pro: boolean
}
