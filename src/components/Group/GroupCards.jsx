"use client"

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useGroupStore from "@/stores/groupStore";
import { Users } from "lucide-react";

export function GroupCards() {
  const { groups, removeGroup } = useGroupStore();

  if (!groups || groups.length === 0) {
    return <div className="text-center text-slate-500 py-8">No Group Detected</div>;
  }

  return (
    <>
      {groups.map((group) => (
        <Card
          key={group.id}
          className="w-full max-w-sm rounded-2xl shadow-lg bg-white border border-slate-200/60 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
        >
          <CardHeader className="pb-2 pt-4 px-5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-bold text-slate-900 truncate">
                  {group.name}
                </CardTitle>
                <CardDescription className="text-slate-500 mt-0.5 text-xs">
                  {group.description}
                </CardDescription>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-full border border-slate-200 shrink-0">
                <Users className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-xs font-semibold text-slate-700">
                  {group.totalMembers}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="py-2.5 px-5">
            <div className="flex gap-2">
              <div className="flex-1 bg-slate-50 rounded-xl p-2.5 border border-slate-200/50">
                <div className="text-xs font-medium text-slate-500 mb-0.5">Currency</div>
                <div className="text-base font-bold text-slate-900">{group.currency}</div>
              </div>
              <div className="flex-1 bg-slate-50 rounded-xl p-2.5 border border-slate-200/50">
                <div className="text-xs font-medium text-slate-500 mb-0.5">Purpose</div>
                <div className="text-base font-bold text-slate-900">{group.category}</div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex gap-2 pt-2 pb-4 px-5">
            <Button
              type="button"
              className="flex-1 bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white font-semibold rounded-xl shadow-md transition-all duration-300 h-9 text-sm"
            >
              View
            </Button>
            <Button
              variant="outline"
              onClick={() => removeGroup(group.id)}
              className="flex-1 border-2 border-slate-200 text-slate-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600 font-semibold rounded-xl transition-all duration-300 h-9 text-sm"
            >
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}
