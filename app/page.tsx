"use client";

import React, { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Lock, Edit3, Save, X, TrendingUp, Shield, Pencil } from "lucide-react";
import Link from "next/link";

export default function TimeManagementDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const [data, setData] = useState([
    { subject: "Strength", A: 78, fullMark: 100 },
    { subject: "IQ", A: 82, fullMark: 100 },
    { subject: "Stamina", A: 69, fullMark: 100 },
    { subject: "Skills", A: 56, fullMark: 100 },
    { subject: "Career", A: 52, fullMark: 100 },
  ]);

  const [editData, setEditData] = useState([...data]);

  const HARDCODED_PASSWORD = "tanishqkrk";

  const handlePasswordSubmit = () => {
    if (password === HARDCODED_PASSWORD) {
      setIsAuthenticated(true);
      setShowPasswordDialog(false);
      setPassword("");
    } else {
      alert("Incorrect password");
    }
  };

  const handleEdit = () => {
    if (!isAuthenticated) {
      setShowPasswordDialog(true);
    } else {
      setIsEditing(true);
      setEditData([...data]);
    }
  };

  const handleSave = () => {
    setData([...editData]);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData([...data]);
    setIsEditing(false);
  };

  const updateValue = (index: number, value: string) => {
    const newData = [...editData];
    newData[index].A = Math.max(0, Math.min(100, parseInt(value) || 0));
    setEditData(newData);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-500/10 border-emerald-500/20";
    if (score >= 60) return "bg-yellow-500/10 border-yellow-500/20";
    return "bg-red-500/10 border-red-500/20";
  };

  const averageScore = Math.round(
    data.reduce((sum, item) => sum + item.A, 0) / data.length
  );

  const [showMetrics, setShowMetrics] = useState(false);

  return (
    <div className="h-screen overflow-hidden bg-neutral-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800/50 backdrop-blur-xl bg-neutral-950  z-10 fixed w-full top-0">
        <div className=" mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0">
              <div className="w-10 h-10 rounded-xl  flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold ">Stats</h1>
              </div>
            </div>
            <div className="max-xl:hidden inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/30 border border-gray-700/30">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
              <span className="text-xs text-gray-400">
                Development mode
                {/* - Password: admin123 */}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-3">
                <Badge variant="default">
                  <span className="text-xs text-gray-300">Average: </span>
                  <span
                    className={`text-sm font-semibold ${getScoreColor(
                      averageScore
                    )}`}
                  >
                    {averageScore}%
                  </span>
                </Badge>

                {isAuthenticated && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <Shield className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs text-emerald-400">
                      Authenticated
                    </span>
                  </div>
                )}
              </div>
              <Link href={"/entry"}>
                <Button
                  variant={"secondary"}
                  className="text-xs text-black bg-[#06b6d4] cursor-pointer"
                >
                  <Pencil></Pencil>{" "}
                  <p className="hidden xl:block">Submit Entry</p>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="  px-6 py-8 ">
        <div className="grid grid-cols-1 xl:grid-cols-5 xl:gap-8 ">
          {/* Radar Chart - Takes up more space */}
          <div className="xl:col-span-4 ">
            <Card className="bg-neutral-950 border-none overflow-hidden pt-0">
              {/* <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white/90 font-medium">
                  Performance Radar
                </CardTitle>
              </CardHeader> */}
              <CardContent className="p-0">
                <div className="xl:h-screen h-[80vh]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      data={data}
                      margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                    >
                      <PolarGrid
                        stroke="#374151"
                        strokeWidth={0.5}
                        strokeOpacity={0.8}
                      />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{
                          fill: "#d1d5db",
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                        className="text-gray-300"
                      />
                      <PolarRadiusAxis
                        tick={{
                          fill: "#9ca3af",
                          fontSize: 9,
                          fontWeight: 400,
                        }}
                        tickCount={5}
                        domain={[0, 100]}
                        axisLine={false}
                      />
                      <Radar
                        name="Performance"
                        dataKey="A"
                        stroke="#06b6d4"
                        fill="#06b6d4"
                        fillOpacity={0.15}
                        strokeWidth={2}
                        dot={{
                          fill: "#06b6d4",
                          strokeWidth: 2,
                          r: 3,
                          stroke: "#ffffff",
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data Panel - Cleaner, more compact */}
          <div className="xl:hidden block">
            <Drawer>
              <DrawerTrigger
                className="flex justify-center items-center w-full"
                asChild
              >
                <Button>Show Metrics</Button>
              </DrawerTrigger>
              <DrawerContent className="bg-neutral-950 px-6  shadow-none border-neutral-600 pb-6">
                <DrawerHeader>
                  <DrawerTitle>Metrics</DrawerTitle>
                </DrawerHeader>

                <div className="space-y-3">
                  {data.map((item, index) => (
                    <Badge
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 w-full ${getScoreBg(
                        item.A
                      )}`}
                      key={item.subject}
                    >
                      <div className="flex-1">
                        <Label className="text-white/90 font-medium text-sm leading-tight">
                          {item.subject}
                        </Label>
                      </div>
                      {
                        <div className="flex items-center gap-2">
                          <span
                            className={` font-bold tabular-nums ${getScoreColor(
                              item.A
                            )}`}
                          >
                            {item.A}
                          </span>
                          <span className="text-xs text-gray-400">%</span>
                        </div>
                      }
                    </Badge>
                  ))}
                </div>
              </DrawerContent>
            </Drawer>
          </div>

          <div className="xl:col-span-1 h-full flex justify-center items-center max-xl:hidden">
            <Card className="bg-neutral-950 border-gray-800/50 backdrop-blur-sm  w-full h-fit max-xl:border-2">
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-white/90 font-medium">
                    Metrics
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pb-6">
                {data.map((item, index) => (
                  <Badge
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 w-full ${getScoreBg(
                      item.A
                    )}`}
                    key={item.subject}
                  >
                    <div className="flex-1">
                      <Label className="text-white/90 font-medium text-sm leading-tight">
                        {item.subject}
                      </Label>
                    </div>
                    {
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-base font-bold tabular-nums ${getScoreColor(
                            item.A
                          )}`}
                        >
                          {item.A}
                        </span>
                        {/* <span className="text-xs text-gray-400">%</span> */}
                      </div>
                    }
                  </Badge>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            {/* <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="bg-gray-900/30 border border-gray-800/50 rounded-xl p-4 text-center backdrop-blur-sm">
                <div className="text-2xl font-bold text-emerald-400">
                  {data.filter((item) => item.A >= 80).length}
                </div>
                <div className="text-xs text-gray-400 mt-1">Excellent</div>
              </div>
              <div className="bg-gray-900/30 border border-gray-800/50 rounded-xl p-4 text-center backdrop-blur-sm">
                <div className="text-2xl font-bold text-yellow-400">
                  {data.filter((item) => item.A >= 60 && item.A < 80).length}
                </div>
                <div className="text-xs text-gray-400 mt-1">Good</div>
              </div>
              <div className="bg-gray-900/30 border border-gray-800/50 rounded-xl p-4 text-center backdrop-blur-sm">
                <div className="text-2xl font-bold text-red-400">
                  {data.filter((item) => item.A < 60).length}
                </div>
                <div className="text-xs text-gray-400 mt-1">Needs Work</div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Password Dialog */}
        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <DialogContent className="bg-neutral-950 border-gray-800/30 text-white backdrop-blur-2xl max-w-md rounded-2xl shadow-2xl">
            <DialogHeader className="pb-2">
              <DialogTitle className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-800/50 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="text-xl font-semibold">
                  Authentication Required
                </span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 pt-4">
              {/* <p className="text-gray-400 leading-relaxed">
                Enter the password to enable editing mode and modify performance
                data.
              </p> */}

              <div className="space-y-3">
                {/* <Label htmlFor="password" className="text-gray-300 text-sm">
                  Password
                </Label> */}
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
                  className="mt-1.5 bg-gray-800/30 border-gray-700/30 text-white 
                           focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30
                           h-11 rounded-xl transition-all duration-200"
                  placeholder="Enter your password"
                  autoFocus
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <Button
                  onClick={() => {
                    setShowPasswordDialog(false);
                    setPassword("");
                  }}
                  variant="outline"
                  className="border-gray-700/30 bg-gray-800/30 text-gray-300 
                           hover:bg-gray-700/50 hover:text-white transition-all 
                           duration-200 rounded-xl px-5"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePasswordSubmit}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl 
                           px-5 transition-all duration-200"
                >
                  Authenticate
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Footer hint */}
      </div>
    </div>
  );
}
