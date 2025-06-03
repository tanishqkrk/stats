import { setDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/fireabase";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Download, Plus, Save, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface Metric {
  id: string;
  name: string;
  current: number;
  goal: number;
  unit: string;
}

interface Section {
  id: string;
  name: string;
  metrics: Metric[];
  percentage: number;
}

type MetricsData = Section[];

const initialData: MetricsData = [
  {
    id: "Strength",
    name: "Strength",
    metrics: [
      {
        id: "Bench Press",
        name: "Bench Press",
        current: 50,
        goal: 100,
        unit: "kg",
      },
      {
        id: "Pull ups",
        name: "Pull ups",
        current: 10,
        goal: 30,
        unit: "clean",
      },
    ],
    percentage: 0,
  },
  {
    id: "Stamina",
    name: "Stamina",
    metrics: [
      {
        id: "Jog",
        name: "Jog",
        current: 0.5,
        goal: 3,
        unit: "km",
      },
      {
        id: "Heavy Bag workout",
        name: "Heavy Bag workout",
        current: 30,
        goal: 180,
        unit: "s",
      },
    ],
    percentage: 0,
  },
  {
    id: "IQ",
    name: "IQ",
    metrics: [
      {
        id: "Maths",
        name: "Maths",
        current: 0,
        goal: 4,
        unit: "units",
      },
      {
        id: "Chess",
        name: "Chess",
        current: 1,
        goal: 3,
        unit: "rank",
      },
      {
        id: "Books",
        name: "Books",
        current: 0,
        goal: 4,
        unit: "read",
      },
    ],
    percentage: 0,
  },
  {
    id: "Skills",
    name: "Skills",
    metrics: [
      {
        id: "Projects",
        name: "Projects",
        current: 0,
        goal: 5,
        unit: "launched",
      },
    ],
    percentage: 0,
  },
  {
    id: "Career",
    name: "Career",
    metrics: [
      {
        id: "Total comp",
        name: "Total comp",
        current: 5.4,
        goal: 24,
        unit: "Rs.",
      },
    ],
    percentage: 0,
  },
];

export default function MetricsEditor() {
  const [data, setData] = useState<MetricsData>([]);

  useEffect(() => {
    (async function () {
      const fetched = await getDoc(doc(db, "stats", "stats"));
      setData(() => fetched.data()?.stats as MetricsData);
    })();
  }, []);

  // Auto-calculate percentages whenever data changes
  useEffect(() => {
    const updatedData: MetricsData = data?.map((section: Section) => {
      const metricPercentages: number[] = section.metrics.map(
        (metric: Metric) => {
          if (metric.goal === 0) return 0;
          return Math.min((metric.current / metric.goal) * 100, 100);
        }
      );

      const sectionPercentage: number =
        metricPercentages.length > 0
          ? metricPercentages.reduce(
              (sum: number, perc: number) => sum + perc,
              0
            ) / metricPercentages.length
          : 0;

      return {
        ...section,
        percentage: Math.round(sectionPercentage * 100) / 100,
      };
    });

    // Only update if percentages changed to avoid infinite loops
    const hasChanged = updatedData?.some(
      (section, index) => section.percentage !== data[index].percentage
    );

    if (hasChanged) {
      setData(updatedData);
    }
  }, [data]);

  const updateSectionName = (sectionIndex: number, newName: string): void => {
    setData((prevData) => {
      const updatedData: MetricsData = [...prevData];
      updatedData[sectionIndex] = {
        ...updatedData[sectionIndex],
        name: newName,
        id: newName,
      };
      return updatedData;
    });
  };

  const updateMetric = (
    sectionIndex: number,
    metricIndex: number,
    field: keyof Metric,
    value: string
  ): void => {
    setData((prevData) => {
      const updatedData: MetricsData = [...prevData];
      const updatedSection = { ...updatedData[sectionIndex] };
      const updatedMetrics = [...updatedSection.metrics];
      const updatedMetric = { ...updatedMetrics[metricIndex] };

      if (field === "name" || field === "unit" || field === "id") {
        (updatedMetric[field] as string) = value;
      } else {
        (updatedMetric[field] as number) = parseFloat(value) || 0;
      }

      if (field === "name") {
        updatedMetric.id = value;
      }

      updatedMetrics[metricIndex] = updatedMetric;
      updatedSection.metrics = updatedMetrics;
      updatedData[sectionIndex] = updatedSection;

      return updatedData;
    });
  };

  const addMetric = (sectionIndex: number): void => {
    setData((prevData) => {
      const updatedData: MetricsData = [...prevData];
      const timestamp = Date.now().toString();
      const newMetric: Metric = {
        id: `New Metric ${timestamp}`,
        name: `New Metric`,
        current: 0,
        goal: 1,
        unit: "units",
      };
      updatedData[sectionIndex] = {
        ...updatedData[sectionIndex],
        metrics: [...updatedData[sectionIndex].metrics, newMetric],
      };
      return updatedData;
    });
  };

  const removeMetric = (sectionIndex: number, metricIndex: number): void => {
    setData((prevData) => {
      const updatedData: MetricsData = [...prevData];
      updatedData[sectionIndex] = {
        ...updatedData[sectionIndex],
        metrics: updatedData[sectionIndex].metrics.filter(
          (_, index) => index !== metricIndex
        ),
      };
      return updatedData;
    });
  };

  const addSection = (): void => {
    const timestamp = Date.now().toString();
    const newSection: Section = {
      id: `New Section ${timestamp}`,
      name: `New Section`,
      metrics: [],
      percentage: 0,
    };
    setData((prevData) => [...prevData, newSection]);
  };

  const removeSection = (sectionIndex: number): void => {
    setData((prevData) =>
      prevData.filter((_, index) => index !== sectionIndex)
    );
  };

  const getPercentageColor = (percentage: number): string => {
    if (percentage >= 80) return "bg-emerald-500 hover:bg-emerald-600";
    if (percentage >= 60) return "bg-blue-500 hover:bg-blue-600";
    if (percentage >= 40) return "bg-yellow-500 hover:bg-yellow-600";
    if (percentage >= 20) return "bg-orange-500 hover:bg-orange-600";
    return "bg-red-500 hover:bg-red-600";
  };

  const getProgressBarColor = (percentage: number): string => {
    if (percentage >= 80) return "bg-emerald-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-yellow-500";
    if (percentage >= 20) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-3 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-neutral-900 rounded-xl p-4 sm:p-6 shadow-2xl border border-neutral-800 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Metrics Dashboard
            </h1>
            <p className="text-neutral-400 mt-1 text-sm sm:text-base">
              Track and edit your progress across different areas
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              onClick={addSection}
              variant="outline"
              className="px-4 sm:px-6 border-neutral-700 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 hover:text-white text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
            <Button
              onClick={async () => {
                await setDoc(doc(db, "stats", "stats"), { stats: data });
              }}
              variant="outline"
              className="px-4 sm:px-6 border-neutral-700 bg-blue-600 text-neutral-200 hover:bg-neutral-700 hover:text-white text-sm cursor-pointer"
            >
              <Save className="w-4 h-4 mr-2"></Save> Save
            </Button>
          </div>
        </div>

        {/* Sections */}
        <div className="grid gap-4 sm:gap-6">
          {data?.map((section: Section, sectionIndex: number) => (
            <Card
              key={section.id}
              className="bg-neutral-900 shadow-2xl border border-neutral-800"
            >
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <Input
                      disabled
                      value={section.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateSectionName(sectionIndex, e.target.value)
                      }
                      className="text-lg sm:text-xl font-semibold border-0 bg-transparent p-0 h-auto focus-visible:ring-0 text-white flex-1"
                    />
                    <Badge
                      className={`${getPercentageColor(
                        section.percentage
                      )} text-white px-2 sm:px-3 py-1 transition-colors text-xs sm:text-sm shrink-0`}
                    >
                      {section.percentage}%
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => addMetric(sectionIndex)}
                      size="sm"
                      variant="outline"
                      className="border-neutral-700 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 hover:text-white text-xs sm:text-sm"
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Add Metric
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-400 border-red-800 bg-neutral-800 hover:bg-red-900/20 hover:text-red-300"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-neutral-900 border-neutral-800">
                        <DialogHeader>
                          <DialogTitle className="text-white">
                            Remove Section
                          </DialogTitle>
                          <DialogDescription className="text-neutral-400">
                            Are you sure you want to remove this section? This
                            action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button
                              variant="outline"
                              className="border-neutral-700 bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
                            >
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button
                            onClick={() => removeSection(sectionIndex)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Remove
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:gap-4">
                  {section.metrics.map(
                    (metric: Metric, metricIndex: number) => {
                      const percentage: number =
                        metric.goal > 0
                          ? Math.min((metric.current / metric.goal) * 100, 100)
                          : 0;

                      return (
                        <div
                          key={metric.id}
                          className="bg-neutral-800 rounded-lg p-3 sm:p-4 border border-neutral-700"
                        >
                          {/* Mobile Layout */}
                          <div className="block sm:hidden space-y-3">
                            <div className="flex items-center justify-between">
                              <Input
                                disabled
                                value={metric.name}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                  updateMetric(
                                    sectionIndex,
                                    metricIndex,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className="bg-neutral-700 border-neutral-600 text-white focus:border-neutral-500 text-sm font-medium flex-1 mr-2"
                                placeholder="Metric name"
                              />
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={`${getPercentageColor(
                                    percentage
                                  )} text-white border-0 transition-colors text-xs`}
                                >
                                  {Math.round(percentage)}%
                                </Badge>
                                <Button
                                  onClick={() =>
                                    removeMetric(sectionIndex, metricIndex)
                                  }
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-400 hover:bg-red-900/20 hover:text-red-300 h-6 w-6 p-0"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <Label className="text-xs font-medium text-neutral-400">
                                  Current
                                </Label>
                                <Input
                                  type="number"
                                  step="0.1"
                                  value={metric.current}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) =>
                                    updateMetric(
                                      sectionIndex,
                                      metricIndex,
                                      "current",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 bg-neutral-700 border-neutral-600 text-white focus:border-neutral-500 text-sm h-8"
                                />
                              </div>

                              <div>
                                <Label className="text-xs font-medium text-neutral-400">
                                  Goal
                                </Label>
                                <Input
                                  type="number"
                                  step="0.1"
                                  value={metric.goal}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) =>
                                    updateMetric(
                                      sectionIndex,
                                      metricIndex,
                                      "goal",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 bg-neutral-700 border-neutral-600 text-white focus:border-neutral-500 text-sm h-8"
                                />
                              </div>

                              <div>
                                <Label className="text-xs font-medium text-neutral-400">
                                  Unit
                                </Label>
                                <Input
                                  disabled
                                  value={metric.unit}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) =>
                                    updateMetric(
                                      sectionIndex,
                                      metricIndex,
                                      "unit",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 bg-neutral-700 border-neutral-600 text-white focus:border-neutral-500 text-sm h-8"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Desktop Layout */}
                          <div className="hidden sm:grid sm:grid-cols-6 gap-4 items-end">
                            <div className="col-span-2">
                              <Label className="text-sm font-medium text-neutral-300">
                                Metric Name
                              </Label>
                              <Input
                                value={metric.name}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                  updateMetric(
                                    sectionIndex,
                                    metricIndex,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className="mt-1 bg-neutral-700 border-neutral-600 text-white focus:border-neutral-500"
                              />
                            </div>

                            <div>
                              <Label className="text-sm font-medium text-neutral-300">
                                Current
                              </Label>
                              <Input
                                type="number"
                                step="0.1"
                                value={metric.current}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                  updateMetric(
                                    sectionIndex,
                                    metricIndex,
                                    "current",
                                    e.target.value
                                  )
                                }
                                className="mt-1 bg-neutral-700 border-neutral-600 text-white focus:border-neutral-500"
                              />
                            </div>

                            <div>
                              <Label className="text-sm font-medium text-neutral-300">
                                Goal
                              </Label>
                              <Input
                                type="number"
                                step="0.1"
                                value={metric.goal}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                  updateMetric(
                                    sectionIndex,
                                    metricIndex,
                                    "goal",
                                    e.target.value
                                  )
                                }
                                className="mt-1 bg-neutral-700 border-neutral-600 text-white focus:border-neutral-500"
                              />
                            </div>

                            <div>
                              <Label className="text-sm font-medium text-neutral-300">
                                Unit
                              </Label>
                              <Input
                                value={metric.unit}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                  updateMetric(
                                    sectionIndex,
                                    metricIndex,
                                    "unit",
                                    e.target.value
                                  )
                                }
                                className="mt-1 bg-neutral-700 border-neutral-600 text-white focus:border-neutral-500"
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <Badge
                                className={`${getPercentageColor(
                                  percentage
                                )} text-white border-0 transition-colors`}
                              >
                                {Math.round(percentage)}%
                              </Badge>
                              <Button
                                onClick={() =>
                                  removeMetric(sectionIndex, metricIndex)
                                }
                                size="sm"
                                variant="ghost"
                                className="text-red-400 hover:bg-red-900/20 hover:text-red-300 h-8 w-8 p-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-3">
                            <div className="w-full bg-neutral-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor(
                                  percentage
                                )}`}
                                style={{
                                  width: `${Math.min(percentage, 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* JSON Output */}
        {/* {savedJson && (
          <Card className="bg-neutral-900 shadow-2xl border border-neutral-800">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg font-semibold text-white">
                Generated JSON
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-neutral-950 text-emerald-400 p-3 sm:p-4 rounded-lg text-xs sm:text-sm overflow-auto max-h-60 sm:max-h-96 font-mono border border-neutral-800">
                {savedJson}
              </pre>
            </CardContent>
          </Card>
        )} */}
      </div>
    </div>
  );
}
