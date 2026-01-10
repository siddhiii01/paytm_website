import type { JSX } from "react"
import { Navbar } from "../Layout/Navbar"
import { BalanceHero } from "./BalanceHero"
import { QuickActions } from "./QuickActions"

export const Dashboard = (): JSX.Element => {
    return (
       <div>

                <Navbar />
                {/* THIS GRID CONTROLS THE LAYOUT */}
                <div className="grid grid-cols-3 gap-6 items-start p-9">
                    {/* Wallet card (2/3 width) */}
                    <div className="col-span-2">
                        <BalanceHero />
                    </div>

                    {/* Quick actions (1/3 width) */}
                    <div className="col-span-1">
                        <QuickActions />
                    </div>
                </div>

            </div>

        
    )
}