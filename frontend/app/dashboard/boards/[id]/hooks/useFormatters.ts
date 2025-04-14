import React from "react";

export const useFormatters = () => {
  const getResaltedText = (term: string, text?: string) => {
    if (!term) return text;
    if (!text) return;
    
    const regex = new RegExp(`(${term})`, "gi");
    return text.split(regex).map((parte, i) => {
      return regex.test(parte) ? (
        React.createElement(
          "mark",
          { key: i, className: "bg-yellow-200 text-black px-0.5" },
          parte
        )
      ) : (
        parte
      );
    });
  };

  const getPriorityColor = (priority: any): string => {
    if (typeof priority === "string") {
      if (priority === "Low" || priority === "low")
        return "bg-green-500/10 text-green-500";
      if (priority === "Medium" || priority === "medium")
        return "bg-amber-500/10 text-amber-500";
      if (priority === "High" || priority === "high")
        return "bg-destructive/10 text-destructive";
      if (priority === "Critical" || priority === "critical")
        return "bg-destructive/10 text-destructive";
    }

    const priorityNum = Number(priority);
    if (!isNaN(priorityNum)) {
      if (priorityNum === 4) return "bg-destructive/10 text-destructive"; // Critical
      if (priorityNum === 3) return "bg-destructive/10 text-destructive"; // High
      if (priorityNum === 2) return "bg-amber-500/10 text-amber-500"; // Medium
      if (priorityNum === 1) return "bg-green-500/10 text-green-500"; // Low
    }

    return "bg-muted text-muted-foreground";
  };

  const formatDate = (dateString: string | Date | null): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCommentTime = (timestamp: string | Date | null): string => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  return {
    getResaltedText,
    getPriorityColor,
    formatDate,
    formatCommentTime
  };
} 