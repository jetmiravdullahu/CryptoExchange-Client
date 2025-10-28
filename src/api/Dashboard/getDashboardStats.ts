import api from '..'
import type { SuccessResponse } from '../types'

/*

"data": {
        "global_balances": {
            "by_asset": [
                {
                    "asset": "4",
                    "asset_id": "cc0bed32-932f-4e97-8806-c113ce09e10b",
                    "total_balance": "52441.00000000",
                    "available_balance": "52441.00000000",
                    "reserved_balance": "0.00000000",
                    "account_count": 8,
                    "base_balance": "2000.00000000",
                    "location_balance": "50441.00000000",
                    "transit_balance": "0"
                },
                {
                    "asset": "3",
                    "asset_id": "8e0c15f5-5e78-4175-ae5a-788891b78380",
                    "total_balance": "398119.20000000",
                    "available_balance": "398119.20000000",
                    "reserved_balance": "0.00000000",
                    "account_count": 8,
                    "base_balance": "2000.00000000",
                    "location_balance": "396119.20000000",
                    "transit_balance": "0"
                },
                {
                    "asset": "2",
                    "asset_id": "dfbd1738-d034-4fae-b5d8-36e8aa36d196",
                    "total_balance": "23394.40000000",
                    "available_balance": "23394.40000000",
                    "reserved_balance": "0.00000000",
                    "account_count": 9,
                    "base_balance": "2000.00000000",
                    "location_balance": "20394.40000000",
                    "transit_balance": "1000.00000000"
                },
                {
                    "asset": "1",
                    "asset_id": "a0b65ec9-dbfc-47f9-a755-cb2545498fef",
                    "total_balance": "72012.00000000",
                    "available_balance": "72012.00000000",
                    "reserved_balance": "0.00000000",
                    "account_count": 8,
                    "base_balance": "2000.00000000",
                    "location_balance": "70012.00000000",
                    "transit_balance": "0"
                },
                {
                    "asset": "123",
                    "asset_id": "8d60dede-5f1d-4f14-97b0-177a63b6d471",
                    "total_balance": "2803.00000000",
                    "available_balance": "2803.00000000",
                    "reserved_balance": "0.00000000",
                    "account_count": 9,
                    "base_balance": "2000.00000000",
                    "location_balance": "753.00000000",
                    "transit_balance": "50.00000000"
                }
            ],
            "total_accounts": 42
        },
        "location_balances": [
            {
                "location_id": "35dc92ce-4526-4a38-a748-d60b1afd05a2",
                "location_name": "Test 1",
                "location_code": "123",
                "is_active": true,
                "balances": [
                    {
                        "asset": "1",
                        "asset_id": "a0b65ec9-dbfc-47f9-a755-cb2545498fef",
                        "balance": "70012.00000000",
                        "available": "70012.00000000",
                        "reserved": "0.00000000"
                    },
                    {
                        "asset": "123",
                        "asset_id": "8d60dede-5f1d-4f14-97b0-177a63b6d471",
                        "balance": "703.00000000",
                        "available": "703.00000000",
                        "reserved": "0.00000000"
                    },
                    {
                        "asset": "2",
                        "asset_id": "dfbd1738-d034-4fae-b5d8-36e8aa36d196",
                        "balance": "19894.40000000",
                        "available": "19894.40000000",
                        "reserved": "0.00000000"
                    },
                    {
                        "asset": "4",
                        "asset_id": "cc0bed32-932f-4e97-8806-c113ce09e10b",
                        "balance": "50441.00000000",
                        "available": "50441.00000000",
                        "reserved": "0.00000000"
                    },
                    {
                        "asset": "3",
                        "asset_id": "8e0c15f5-5e78-4175-ae5a-788891b78380",
                        "balance": "396119.20000000",
                        "available": "396119.20000000",
                        "reserved": "0.00000000"
                    }
                ]
            },
            {
                "location_id": "ce4d4264-4c8c-411e-a7bc-effc68cc7f57",
                "location_name": "Rahovec",
                "location_code": "1234",
                "is_active": true,
                "balances": [
                    {
                        "asset": "4",
                        "asset_id": "cc0bed32-932f-4e97-8806-c113ce09e10b",
                        "balance": "0.00000000",
                        "available": "0.00000000",
                        "reserved": "0.00000000"
                    },
                    {
                        "asset": "3",
                        "asset_id": "8e0c15f5-5e78-4175-ae5a-788891b78380",
                        "balance": "0.00000000",
                        "available": "0.00000000",
                        "reserved": "0.00000000"
                    },
                    {
                        "asset": "1",
                        "asset_id": "a0b65ec9-dbfc-47f9-a755-cb2545498fef",
                        "balance": "0.00000000",
                        "available": "0.00000000",
                        "reserved": "0.00000000"
                    },
                    {
                        "asset": "123",
                        "asset_id": "8d60dede-5f1d-4f14-97b0-177a63b6d471",
                        "balance": "0.00000000",
                        "available": "0.00000000",
                        "reserved": "0.00000000"
                    },
                    {
                        "asset": "2",
                        "asset_id": "dfbd1738-d034-4fae-b5d8-36e8aa36d196",
                        "balance": "125.00000000",
                        "available": "125.00000000",
                        "reserved": "0.00000000"
                    }
                ]
            },
            {
                "location_id": "07aea7fc-860a-47a3-af5c-f31a8aabfd67",
                "location_name": "Prishtina",
                "location_code": "123456",
                "is_active": true,
                "balances": [
                    {
                        "asset": "4",
                        "asset_id": "cc0bed32-932f-4e97-8806-c113ce09e10b",
                        "balance": "0.00000000",
                        "available": "0.00000000",
                        "reserved": "0.00000000"
                    },
                    {
                        "asset": "3",
                        "asset_id": "8e0c15f5-5e78-4175-ae5a-788891b78380",
                        "balance": "0.00000000",
                        "available": "0.00000000",
                        "reserved": "0.00000000"
                    },
                    {
                        "asset": "1",
                        "asset_id": "a0b65ec9-dbfc-47f9-a755-cb2545498fef",
                        "balance": "0.00000000",
                        "available": "0.00000000",
                        "reserved": "0.00000000"
                    },
                    {
                        "asset": "123",
                        "asset_id": "8d60dede-5f1d-4f14-97b0-177a63b6d471",
                        "balance": "0.00000000",
                        "available": "0.00000000",
                        "reserved": "0.00000000"
                    },
                    {
                        "asset": "2",
                        "asset_id": "dfbd1738-d034-4fae-b5d8-36e8aa36d196",
                        "balance": "375.00000000",
                        "available": "375.00000000",
                        "reserved": "0.00000000"
                    }
                ]
            },
            {
                "location_id": "7458044b-d3b5-4de9-b30c-0aa38921c186",
                "location_name": "LocationFee",
                "location_code": "121212",
                "is_active": true,
                "balances": [
                    {
                        "asset": "4",
                        "asset_id": "cc0bed32-932f-4e97-8806-c113ce09e10b",
                        "balance": "0.00000000",
                        "available": "0.00000000",
                        "reserved": "0.00000000"
                    },
                    {
                        "asset": "3",
                        "asset_id": "8e0c15f5-5e78-4175-ae5a-788891b78380",
                        "balance": "0.00000000",
                        "available": "0.00000000",
                        "reserved": "0.00000000"
                    },
                    {
                        "asset": "2",
                        "asset_id": "dfbd1738-d034-4fae-b5d8-36e8aa36d196",
                        "balance": "0.00000000",
                        "available": "0.00000000",
                        "reserved": "0.00000000"
                    },
                    {
                        "asset": "1",
                        "asset_id": "a0b65ec9-dbfc-47f9-a755-cb2545498fef",
                        "balance": "0.00000000",
                        "available": "0.00000000",
                        "reserved": "0.00000000"
                    },
                    {
                        "asset": "123",
                        "asset_id": "8d60dede-5f1d-4f14-97b0-177a63b6d471",
                        "balance": "0.00000000",
                        "available": "0.00000000",
                        "reserved": "0.00000000"
                    }
                ]
            },
            {
                "location_id": "346fe12d-f6cd-40a2-b50e-bb220027172e",
                "location_name": "test 3",
                "location_code": "223",
                "is_active": true,
                "balances": [
                    {
                        "asset": "1",
                        "asset_id": "a0b65ec9-dbfc-47f9-a755-cb2545498fef",
                        "balance": "0.00000000",
                        "available": "0.00000000",
                        "reserved": "0.00000000"
                    },
                    {
                        "asset": "2",
                        "asset_id": "dfbd1738-d034-4fae-b5d8-36e8aa36d196",
                        "balance": "0.00000000",
                        "available": "0.00000000",
                        "reserved": "0.00000000"
                    },
                    {
                        "asset": "3",
                        "asset_id": "8e0c15f5-5e78-4175-ae5a-788891b78380",
                        "balance": "0.00000000",
                        "available": "0.00000000",
                        "reserved": "0.00000000"
                    },
                    {
                        "asset": "4",
                        "asset_id": "cc0bed32-932f-4e97-8806-c113ce09e10b",
                        "balance": "0.00000000",
                        "available": "0.00000000",
                        "reserved": "0.00000000"
                    },
                    {
                        "asset": "123",
                        "asset_id": "8d60dede-5f1d-4f14-97b0-177a63b6d471",
                        "balance": "50.00000000",
                        "available": "50.00000000",
                        "reserved": "0.00000000"
                    }
                ]
            },
            {
                "location_id": "10d7fa22-674f-4864-8083-4a6b5e474725",
                "location_name": "LocationFeeFlat",
                "location_code": "123123",
                "is_active": true,
                "balances": [
                    {
                        "asset": "4",
                        "asset_id": "cc0bed32-932f-4e97-8806-c113ce09e10b",
                        "balance": "0.00000000",
                        "available": "0.00000000",
                        "reserved": "0.00000000"
                    },
                    {
                        "asset": "3",
                        "asset_id": "8e0c15f5-5e78-4175-ae5a-788891b78380",
                        "balance": "0.00000000",
                        "available": "0.00000000",
                        "reserved": "0.00000000"
                    },
                    {
                        "asset": "2",
                        "asset_id": "dfbd1738-d034-4fae-b5d8-36e8aa36d196",
                        "balance": "0.00000000",
                        "available": "0.00000000",
                        "reserved": "0.00000000"
                    },
                    {
                        "asset": "1",
                        "asset_id": "a0b65ec9-dbfc-47f9-a755-cb2545498fef",
                        "balance": "0.00000000",
                        "available": "0.00000000",
                        "reserved": "0.00000000"
                    },
                    {
                        "asset": "123",
                        "asset_id": "8d60dede-5f1d-4f14-97b0-177a63b6d471",
                        "balance": "0.00000000",
                        "available": "0.00000000",
                        "reserved": "0.00000000"
                    }
                ]
            }
        ],
        "in_transit_queue": {
            "total_in_transit": 1,
            "exceeding_sla": 1,
            "within_sla": 0,
            "critical_transfers": [
                {
                    "transfer_id": "afebc508-3598-4666-8d41-1efef1a3e581",
                    "transfer_ref": "TRF-20251027-4595F4",
                    "from_location": "test 3",
                    "to_location": "Test 1",
                    "asset": "123",
                    "amount": "50.00000000",
                    "hours_in_transit": 26,
                    "exceeding_sla": true
                }
            ]
        },
        "todays_pnl": {
            "total_revenue": 0,
            "total_transactions": 0,
            "total_volume": 0,
            "average_transaction_size": 0,
            "average_fee": 0,
            "comparison": {
                "yesterday_revenue": 4.1,
                "yesterday_transactions": 3,
                "revenue_change_pct": -100,
                "transactions_change_pct": -100,
                "trend": "down"
            }
        },
        "pending_corrections": {
            "total_today": 0,
            "total_this_week": 0,
            "recent": []
        },
        "reconciliation_status": {
            "unreconciled_snapshots_count": 0,
            "unreconciled_days_count": 0,
            "unreconciled_dates": [],
            "today": {
                "total_accounts": 0,
                "reconciled": 0,
                "pending": 0,
                "completion_pct": 0
            }
        },
        "recent_activity": [
            {
                "type": "transaction",
                "id": "8e44373f-f0aa-4c24-9584-195e76da37e5",
                "ref": "TXN-20251027-D451A3",
                "location": "Test 1",
                "from_asset": "4",
                "to_asset": "3",
                "from_amount": "21.00000000",
                "to_amount": "189.00000000",
                "fee": "2.10000000",
                "status": "COMPLETED",
                "created_by": "Seller",
                "created_at": "2025-10-27T17:34:46+00:00"
            },
            {
                "type": "transaction",
                "id": "2fddea52-c09e-4224-aef9-0b44e754620c",
                "ref": "TXN-20251027-07C860",
                "location": "Test 1",
                "from_asset": "4",
                "to_asset": "3",
                "from_amount": "10.00000000",
                "to_amount": "90.00000000",
                "fee": "1.00000000",
                "status": "COMPLETED",
                "created_by": "Seller",
                "created_at": "2025-10-27T17:33:21+00:00"
            },
            {
                "type": "transaction",
                "id": "86b7b868-84a1-4be9-ac0e-bf845f04b4b6",
                "ref": "TXN-20251027-167F02",
                "location": "Test 1",
                "from_asset": "4",
                "to_asset": "3",
                "from_amount": "10.00000000",
                "to_amount": "90.00000000",
                "fee": "1.00000000",
                "status": "COMPLETED",
                "created_by": "Seller",
                "created_at": "2025-10-27T17:28:22+00:00"
            },
            {
                "type": "transaction",
                "id": "5b4aef30-3d8c-446d-b380-9735cef2bc21",
                "ref": "TXN-20251027-8A60C6",
                "location": "Test 1",
                "from_asset": "4",
                "to_asset": "3",
                "from_amount": "7.00000000",
                "to_amount": "63.00000000",
                "fee": "0.70000000",
                "status": "TIMED_OUT",
                "created_by": "Seller",
                "created_at": "2025-10-27T17:28:02+00:00"
            },
            {
                "type": "transfer",
                "id": "0aa28c8b-796d-458f-a9ed-ae477e4e4b70",
                "ref": "TRF-20251027-DB5F58",
                "from_location": "Rahovec",
                "to_location": "Prishtina",
                "asset": "2",
                "amount": "125.00000000",
                "status": "CONFIRMED",
                "initiated_by": "Rahovec",
                "created_at": "2025-10-27T14:45:37+00:00"
            },
            {
                "type": "transfer",
                "id": "afebc508-3598-4666-8d41-1efef1a3e581",
                "ref": "TRF-20251027-4595F4",
                "from_location": "test 3",
                "to_location": "Test 1",
                "asset": "123",
                "amount": "50.00000000",
                "status": "IN_TRANSIT",
                "initiated_by": "John Doe",
                "created_at": "2025-10-27T14:17:23+00:00"
            },
            {
                "type": "transfer",
                "id": "e567fa30-781a-4662-b708-7b7fa70f0f85",
                "ref": "TRF-20251027-26C4D5",
                "from_location": "Test 1",
                "to_location": "test 3",
                "asset": "2",
                "amount": "300.00000000",
                "status": "RETURNED",
                "initiated_by": "Seller",
                "created_at": "2025-10-27T14:08:17+00:00"
            },
            {
                "type": "transfer",
                "id": "18a6cf49-6688-46df-9a50-f5140b90d980",
                "ref": "TRF-20251027-850376",
                "from_location": "Test 1",
                "to_location": "test 3",
                "asset": "2",
                "amount": "200.00000000",
                "status": "CANCELLED",
                "initiated_by": "Seller",
                "created_at": "2025-10-27T14:04:50+00:00"
            },
            {
                "type": "transfer",
                "id": "2affddcf-ad4a-43ef-ad45-c49898a9bbd4",
                "ref": "TRF-20251027-D5425F",
                "from_location": "Test 1",
                "to_location": "test 3",
                "asset": "2",
                "amount": "100.00000000",
                "status": "CANCELLED",
                "initiated_by": "Seller",
                "created_at": "2025-10-27T14:03:20+00:00"
            },
            {
                "type": "transaction",
                "id": "8ad57d34-bb19-4dc3-bd0c-790d73baf8ed",
                "ref": "TXN-20251026-B40554",
                "location": "Test 1",
                "from_asset": "4",
                "to_asset": "3",
                "from_amount": "200.00000000",
                "to_amount": "1800.00000000",
                "fee": "20.00000000",
                "status": "TIMED_OUT",
                "created_by": "Seller",
                "created_at": "2025-10-26T14:11:42+00:00"
            }
        ],
        "alerts": [
            {
                "type": "sla_breach",
                "severity": "medium",
                "count": 1,
                "message": "1 transfer(s) have exceeded the 8-hour SLA"
            }
        ],
        "quick_stats": {
            "active_locations": 6,
            "active_users": 30,
            "todays_transactions": 0,
            "active_assets": 5
        },
        "generated_at": "2025-10-28T16:20:50+00:00"
    }
*/

interface DashboardData {
  global_balances: {
    by_asset: Array<{
      asset: string
      asset_id: string
      total_balance: string
      available_balance: string
      reserved_balance: string
      account_count: number
      base_balance: string
      location_balance: string
      transit_balance: string
    }>
    total_accounts: number
  }

  location_balances: Array<{
    location_id: string
    location_name: string
    location_code: string
    is_active: boolean
    balances: Array<{
      asset: string
      asset_id: string
      balance: string
      available: string
      reserved: string
    }>
  }>
  in_transit_queue: {
    total_in_transit: number
    exceeding_sla: number
    within_sla: number
    critical_transfers: Array<{
      transfer_id: string
      transfer_ref: string
      from_location: string
      to_location: string
      asset: string
      amount: string
      hours_in_transit: number
      exceeding_sla: boolean
    }>
  }
  todays_pnl: {
    total_revenue: number
    total_transactions: number
    total_volume: number
    average_transaction_size: number
    average_fee: number
    comparison: {
      yesterday_revenue: number
      yesterday_transactions: number
      revenue_change_pct: number
      transactions_change_pct: number
      trend: 'up' | 'down' | 'stable'
    }
  }
  pending_corrections: {
    total_today: number
    total_this_week: number
    recent: Array<any>
  }
  reconciliation_status: {
    unreconciled_snapshots_count: number
    unreconciled_days_count: number
    unreconciled_dates: Array<string>
    today: {
      total_accounts: number
      reconciled: number
      pending: number
      completion_pct: number
    }
  }
  recent_activity: Array<{
    type: string
    id: string
    ref: string
    location?: string
    from_asset?: string
    to_asset?: string
    from_amount?: string
    to_amount?: string
    fee?: string
    status: string
    created_by?: string
    created_at: string
    from_location?: string
    to_location?: string
    asset?: string
    amount?: string
    initiated_by?: string
  }>
  alerts: Array<{
    type: string
    severity: string
    count: number
    message: string
  }>
  quick_stats: {
    active_locations: number
    active_users: number
    todays_transactions: number
    active_assets: number
  }
  generated_at: string
}

export const getDashboardStats = async (): Promise<
  SuccessResponse<DashboardData>['data']
> => {
  const { data } = await api.get<SuccessResponse<DashboardData>>(`/dashboard`)

  return data.data
}
