export interface IReport {
    period: {
        from: string
        to: string
        days: number
    }
    filters: {
        location_count: number
        location_ids: Array<string> | null
        asset_id: string | null
    }
    location_summaries: Array<{
        location_id: string
        location_name: string
        is_active: boolean
        sold: {
            description: string
            total_transaction_count: number
            total_amount: number
            breakdown: Array<{
                asset_id: string
                asset_code: string
                asset_name: string
                transaction_count: number
                total_amount: number
                total_fees: number
            }>
        }
        bought: {
            description: string
            total_transaction_count: number
            total_amount: number
            breakdown: Array<{
                asset_id: string
                asset_code: string
                asset_name: string
                transaction_count: number
                total_amount: number
                total_fees: number
            }>
        }
        fees: {
            total_fees_collected: number
            total_transactions: number
            average_fee_per_transaction: number
        }
        net_balance: {
            description: string
            amount: number
        }
    }>
    totals: {
        sold: {
            description: string
            total_transaction_count: number
            total_amount: number
            breakdown: Array<{
                asset_id: string
                asset_code: string
                asset_name: string
                transaction_count: number
                total_amount: number
                total_fees: number
            }>
        }
        bought: {
            description: string
            total_transaction_count: number
            total_amount: number
            breakdown: Array<{
                asset_id: string
                asset_code: string
                asset_name: string
                transaction_count: number
                total_amount: number
                total_fees: number
            }>
        }
        fees: {
            total_fees_collected: number
            total_transactions: number
            average_fee_per_transaction: number
        }
        net_balance: {
            description: string
            amount: number
        }
    }
    generated_at: string
}