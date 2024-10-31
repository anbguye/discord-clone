"use client"
import { Button } from "@/components/ui/button";
import { AcceptedFriendsList, PendingFriendsList } from "./_components/friends-list";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function FriendsPage() {
    return (
        <div className="flex-1 flex-col flex divide-y">
            <header>
                <h1 className="font-semibold">Friends</h1>
                <Button size="sm">Add Friend</Button>
            </header>
            <div className="grid p-4 gap-4">
                <TooltipProvider>
                    <PendingFriendsList></PendingFriendsList>
                    <AcceptedFriendsList></AcceptedFriendsList>
                </TooltipProvider>
            </div>
        </div>
    );
}