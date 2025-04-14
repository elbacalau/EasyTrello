import React from "react";
import { AssignedUser } from "@/types/userData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface TeamMemberFilterProps {
  teamMembers: AssignedUser[];
  selectedMember: AssignedUser | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSelectMember: (member: AssignedUser) => void;
  clearFilters: () => void;
}

export default function TeamMemberFilter({
  teamMembers,
  selectedMember,
  searchTerm,
  setSearchTerm,
  handleSelectMember,
  clearFilters,
}: TeamMemberFilterProps) {
  return (
    <div className="flex items-center">
      <div className="mr-4">
        <Input
          placeholder="Search task..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {teamMembers.slice(0, 5).map((member: AssignedUser, index: number) => (
        <HoverCard key={member.id}>
          <HoverCardTrigger asChild>
            <div
              className={`w-10 h-10 rounded-full border-2 border-white overflow-hidden transition-transform hover:scale-105 hover:ring-2 hover:ring-blue-400 cursor-pointer ${
                index !== 0 ? "-ml-3" : ""
              } ${
                selectedMember?.id === member.id ? "ring-2 ring-blue-400" : ""
              }`}
              onClick={() => {
                handleSelectMember(member);
              }}
            >
              <img
                src={`https://i.pravatar.cc/150?u=${member.firstName}`}
                alt={member.firstName}
                className="w-full h-full object-cover"
              />
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-auto">
            <div className="flex items-center gap-2">
              <img
                src={`https://i.pravatar.cc/150?u=${member.firstName}`}
                alt={member.firstName}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="font-medium">
                  {member.firstName} {member.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {member.email}
                </p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}

      {teamMembers.length > 5 && (
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="-ml-3 w-10 h-10 rounded-full border-2 border-white bg-gray-200 text-sm flex items-center justify-center font-medium text-gray-600 hover:scale-105 hover:ring-2 hover:ring-blue-400 transition-transform cursor-pointer">
              +{teamMembers.length - 5}
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-auto">
            <div className="space-y-2">
              <p className="font-medium">Miembros adicionales</p>
              <div className="space-y-1">
                {teamMembers.slice(5).map((member) => (
                  <div
                    key={member.id}
                    className={`flex items-center gap-2 cursor-pointer ${
                      selectedMember?.id === member.id
                        ? "ring-2 ring-blue-400 rounded-full p-1"
                        : ""
                    }`}
                    onClick={() => handleSelectMember(member)}
                  >
                    <img
                      src={`https://i.pravatar.cc/150?u=${member.firstName}`}
                      alt={member.firstName}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm">
                      {member.firstName} {member.lastName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      )}

      {(selectedMember || searchTerm.length > 0) && (
        <div className="ml-4 flex items-center gap-2">
          <span className="text-sm">
            {selectedMember &&
              `Filtrado por: ${selectedMember.firstName} ${selectedMember.lastName}`}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
          >
            Limpiar filtro
          </Button>
        </div>
      )}
    </div>
  );
} 