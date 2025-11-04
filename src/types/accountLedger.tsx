import type { UserRole } from "./user";

export type ReferenceType =
  | 'MANUAL_ADJUSTMENT'
  | 'TRANSACTION'
  | 'TRANSFER'
  | 'CORRECTION'

export interface IAccountLedger {
    id: string;
    entry_number: number;
    entry_date: string;
    reference_type: ReferenceType;
    reference_id: string;
    reference_code: string | null;
    description: string;
    debit_amount: string;
    credit_amount: string;
    balance_before: string;
    balance_after: string;
    created_by: {
        id: string;
        name: string;
        role: UserRole;
    };
    created_at: string;
    metadata: Array<any>;
}

export interface IAccountLedgerStats {
    account: {
        id: string;
        asset_code: string;
        asset_name: string;
        owner_type: string;
        owner_name: string;
        current_balance: string;
        available_balance: string;
        reserved_balance: string;
    };
    period: {
        from: string;
        to: string;
        days: number;
    };
    opening_balance: string;
    closing_balance: string;
    net_change: string;
    net_change_percentage: string;
    totals: {
        total_credits: string;
        total_debits: string;
        entry_count: number;
    };
    by_type: {
        transactions: {
            count: number;
            credits: string;
            debits: string;
            net: string;
            fees_collected: string;
        };
        transfers: {
            count: number;
            transfers_in: {
                count: number;
                amount: string;
            };
            transfers_out: {
                count: number;
                amount: string;
            };
            net: string;
        };
        corrections: {
            count: number;
            credits: string;
            debits: string;
            net: string;
        };
        manual_adjustments: {
            count: number;
            credits: string;
            debits: string;
            net: string;
        };
    };
    daily_averages: {
        credits_per_day: string;
        debits_per_day: string;
        entries_per_day: string;
    };
    largest_entries: {
        largest_credit: {
            amount: string;
            date: string;
            reference_type: ReferenceType;
            description: string;
        } | null;
        largest_debit: {
            amount: string;
            date: string;
            reference_type: ReferenceType;
            description: string;
        } | null;
    };
}