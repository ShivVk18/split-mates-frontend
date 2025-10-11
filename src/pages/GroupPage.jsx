
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";

import useFetch from "@/hooks/useFetch";
import useGroupStore from "@/stores/groupStore";
import { GroupCards } from "@/components/Group/GroupCards";

const GroupPage = () => {
  const [groupData] = useFetch("/groups/");
  const { setGroups, setPagination } = useGroupStore();
   
  
  useEffect(() => {
    if (groupData && Array.isArray(groupData.groups)) {
      setGroups(groupData.groups);
      setPagination(groupData);
    }
  }, [groupData, setGroups, setPagination]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-8">
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-blue-600 bg-clip-text text-transparent mb-2">
            Groups
          </h1>
          <p className="text-slate-600">Make Groups, Manage and grow</p>
        </div>
        <div className="flex gap-3">
          <Button
            size="sm"
            onClick={() => console.log("Add Group Clicked")}
            className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl"
          >
            Add Group
          </Button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        <GroupCards />
      </div>
    </div>
  );
};

export default GroupPage;
