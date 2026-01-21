export interface TodayOverviewResponse {
  total_users: number
  percent_increase_users: number
  percent_increase_transactions: number
  percent_increase_admins: number
  percent_increase_new_users: number
  total_transactions: number
  new_users: number
  total_admins: number
}

export interface UserInsightItem {
  month_year: string  // Format: "MM-YYYY"  
  new_users: number
  loyal_users: number
  return_users: number
}

