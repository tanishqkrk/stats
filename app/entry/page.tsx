"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import MetricsEditor from "@/components/Editor";

export default function Entry() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "ungabunga") {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen w-full bg-neutral-950 flex items-center justify-center">
      {!isAuthenticated ? (
        <div className="w-full max-w-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <h1 className="text-2xl font-bold text-white flex justify-center items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-gray-800/50 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-cyan-400" />
                </div>{" "}
                Authentication
              </h1>
            </div>

            <div className="space-y-4">
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setError(false);
                  setPassword(e.target.value);
                }}
                className="bg-gray-800/30 border-gray-700/30 text-white 
                         focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30
                         h-11 rounded-xl transition-all duration-200"
                placeholder="Enter password"
                autoFocus
              />

              {error && (
                <p className="text-sm text-red-400 text-center">
                  Invalid password. Please try again.
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white 
                     rounded-xl py-6 transition-all duration-200"
              >
                Authenticate
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="">
          <MetricsEditor />
        </div>
      )}
    </div>
  );
}
