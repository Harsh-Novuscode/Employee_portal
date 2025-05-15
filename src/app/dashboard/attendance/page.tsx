
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";

import { CalendarCheck, UserCheck, CheckCircle, Clock, UsersRound, CalendarIcon as CalendarIconLucide, LogIn, LogOut, ListChecks, Mail } from "lucide-react";

const manualAttendanceSchema = z.object({
  employeeEmail: z.string().email({ message: "Invalid email address." }),
  attendanceDate: z.date({ required_error: "Attendance date is required." }),
  checkInTime: z.string().optional(), // Optional for statuses like "Absent" or "On Leave"
  checkOutTime: z.string().optional(),
  status: z.enum(["Present", "Absent", "On Leave", "Half Day"], { required_error: "Status is required." }),
});

type ManualAttendanceFormValues = z.infer<typeof manualAttendanceSchema>;

export default function AttendancePage() {
  const [lastCheckIn, setLastCheckIn] = React.useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = React.useState<"Checked Out" | "Checked In">("Checked Out");

  const form = useForm<ManualAttendanceFormValues>({
    resolver: zodResolver(manualAttendanceSchema),
    defaultValues: {
      employeeEmail: "",
      checkInTime: "",
      checkOutTime: "",
    },
  });

  const handleMarkOwnAttendance = () => {
    const now = new Date();
    if (currentStatus === "Checked Out") {
      setLastCheckIn(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setCurrentStatus("Checked In");
      toast({ title: "Check-in Successful", description: `You checked in at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.` });
    } else {
      setLastCheckIn(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      toast({ title: "Attendance Updated", description: `Your check-in time was updated to ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.` });
    }
  };

  const onManualSubmit = (data: ManualAttendanceFormValues) => {
    console.log("Manual Attendance Data:", data);
    // TODO: Implement API call to save/update attendance
    toast({
      title: "Attendance Recorded",
      description: `Attendance for ${data.employeeEmail} on ${format(data.attendanceDate, "PPP")} has been recorded as ${data.status}.`,
    });
    form.reset();
  };

  return (
    <MainLayout>
      <div className="w-full">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
            Employee Attendance
          </h1>
          <p className="text-muted-foreground">Track and manage employee attendance records.</p>
        </header>

        {/* Manual Attendance Entry Card */}
        <Card className="mb-8 shadow-xl rounded-md border border-border/60 bg-card hover:border-primary/70 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fade-in-slide-up">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold text-primary">Manage Employee Attendance</CardTitle>
            <UsersRound className="h-8 w-8 text-accent" />
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm text-muted-foreground mb-6">
              Manually add or update attendance records for employees.
            </CardDescription>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onManualSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="employeeEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground/80 flex items-center">
                          <Mail className="mr-2 h-4 w-4 text-muted-foreground" /> Employee Email
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="employee@example.com" {...field} className="bg-input focus:bg-input/70"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="attendanceDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-sm font-medium text-foreground/80 flex items-center">
                           <CalendarIconLucide className="mr-2 h-4 w-4 text-muted-foreground" /> Attendance Date
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-full justify-start text-left font-normal bg-input hover:bg-input/80 ${
                                  !field.value && "text-muted-foreground"
                                }`}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="checkInTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground/80 flex items-center">
                          <LogIn className="mr-2 h-4 w-4 text-muted-foreground" /> Check-in Time
                        </FormLabel>
                        <FormControl>
                          <Input type="time" {...field} className="bg-input focus:bg-input/70" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="checkOutTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground/80 flex items-center">
                          <LogOut className="mr-2 h-4 w-4 text-muted-foreground" /> Check-out Time
                        </FormLabel>
                        <FormControl>
                          <Input type="time" {...field} className="bg-input focus:bg-input/70" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground/80 flex items-center">
                          <ListChecks className="mr-2 h-4 w-4 text-muted-foreground" /> Status
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-input focus:bg-input/70">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-card border-border text-card-foreground">
                            <SelectItem value="Present">Present</SelectItem>
                            <SelectItem value="Absent">Absent</SelectItem>
                            <SelectItem value="On Leave">On Leave</SelectItem>
                            <SelectItem value="Half Day">Half Day</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full md:w-auto bg-primary hover:bg-primary/80 text-primary-foreground font-semibold py-2.5 px-6 rounded-sm shadow-md hover:shadow-primary/40 transition-all duration-300 ease-out group hover:scale-[1.02] hover:-translate-y-0.5"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Saving..." : "Save Attendance"}
                   <CheckCircle className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Existing Cards for Overview */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-8">
            <Card className="shadow-xl rounded-md border border-border/60 bg-card hover:border-primary/70 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fade-in-slide-up" style={{animationDelay: "100ms"}}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-semibold text-primary">Daily Check-ins Overview</CardTitle>
                    <UserCheck className="h-8 w-8 text-accent" />
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-sm text-muted-foreground mb-4">
                        View today's attendance and overall presence.
                    </CardDescription>
                    <div className="mt-4 p-4 h-40 rounded-md bg-input/50 flex flex-col items-center justify-center border border-border/40">
                        <CheckCircle className="h-10 w-10 text-primary/70 mb-2" />
                        <p className="text-muted-foreground text-sm">Today's check-in data will appear here.</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">(e.g., List of employees checked in)</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="shadow-xl rounded-md border border-border/60 bg-card hover:border-primary/70 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fade-in-slide-up" style={{animationDelay: "200ms"}}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-semibold text-primary">Attendance Reports</CardTitle>
                    <CalendarCheck className="h-8 w-8 text-primary" />
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-sm text-muted-foreground mb-4">
                        Generate and view historical attendance reports.
                    </CardDescription>
                     <div className="mt-4 p-4 h-40 rounded-md bg-input/50 flex flex-col items-center justify-center border border-border/40">
                        <CalendarCheck className="h-10 w-10 text-accent/70 mb-2" />
                        <p className="text-muted-foreground text-sm">Report generation tools will be here.</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">(e.g., Date pickers, filters)</p>
                    </div>
                </CardContent>
            </Card>
        </div>

         {/* My Attendance Status Section */}
         <div className="mt-8 p-6 bg-card border border-border/60 rounded-md shadow-xl animate-fade-in-slide-up" style={{animationDelay: "300ms"}}>
            <h2 className="text-2xl font-semibold text-primary mb-4">My Attendance Status</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <Button 
                    onClick={handleMarkOwnAttendance}
                    className="bg-primary hover:bg-primary/80 text-primary-foreground font-semibold py-3 px-6 text-lg rounded-sm shadow-md hover:shadow-primary/40 transition-all duration-300 ease-out group hover:scale-[1.03] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/50"
                >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    {currentStatus === "Checked Out" ? "Mark My Check-in" : "Update My Check-in"}
                </Button>
                <div className="text-sm">
                    {lastCheckIn && (
                        <p className="text-muted-foreground flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-accent" />
                            Last Check-in: <span className="font-semibold text-foreground ml-1">{lastCheckIn}</span>
                        </p>
                    )}
                    <p className="text-muted-foreground flex items-center mt-1">
                        <UserCheck className="h-4 w-4 mr-2 text-primary" />
                        Current Status: <span className="font-semibold text-foreground ml-1">{currentStatus}</span>
                    </p>
                </div>
            </div>
            <p className="text-xs text-muted-foreground/70 mt-4">
                Use this to mark your own attendance for today. Your check-in time and status will be updated.
            </p>
        </div>
      </div>
    </MainLayout>
  );
}


    