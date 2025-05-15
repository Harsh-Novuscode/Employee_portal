
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format, parse, startOfMonth, isSameDay, isSameMonth, getYear, getMonth } from "date-fns";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";

import { UsersRound, CalendarIcon as CalendarIconLucide, ListChecks, Mail, FileText, Loader2, CheckCircle, UserCheck, UserX, PlaneTakeoff, History, Users, Maximize2, Minimize2, Eye } from "lucide-react";

const manualAttendanceSchema = z.object({
  employeeEmail: z.string().email({ message: "Invalid email address." }),
  attendanceDate: z.date({ required_error: "Attendance date is required." }),
  status: z.enum(["Present", "Absent", "On Leave", "Half Day"], { required_error: "Status is required." }),
});

type ManualAttendanceFormValues = z.infer<typeof manualAttendanceSchema>;

interface MockAttendanceRecord {
  id: string;
  employeeEmail: string;
  attendanceDate: string; // Storing as "PPP" formatted string
  status: "Present" | "Absent" | "On Leave" | "Half Day";
}

interface DailySummary {
  present: number;
  absent: number;
  onLeave: number;
  halfDay: number;
}

interface MonthlySummaryItem extends DailySummary {
  month: string;
  year: number;
  monthKey: string; // For unique key, e.g., "2023-07"
}

type MonthlySummary = MonthlySummaryItem[];


export default function AttendancePage() {
  const [isLoadingRecords, setIsLoadingRecords] = React.useState(true);
  const [attendanceRecords, setAttendanceRecords] = React.useState<MockAttendanceRecord[]>([]);
  
  const [isDailyDetailDialogOpen, setIsDailyDetailDialogOpen] = React.useState(false);
  const [dailyDetailDialogTitle, setDailyDetailDialogTitle] = React.useState("");
  const [dailyDetailDialogRecords, setDailyDetailDialogRecords] = React.useState<Pick<MockAttendanceRecord, 'employeeEmail' | 'status'>[]>([]);

  const [isMonthlyDetailDialogOpen, setIsMonthlyDetailDialogOpen] = React.useState(false);
  const [monthlyDetailDialogTitle, setMonthlyDetailDialogTitle] = React.useState("");
  const [monthlyDetailDialogRecords, setMonthlyDetailDialogRecords] = React.useState<MockAttendanceRecord[]>([]);
  
  const [isAllRecordsTableExpanded, setIsAllRecordsTableExpanded] = React.useState(false);


  const form = useForm<ManualAttendanceFormValues>({
    resolver: zodResolver(manualAttendanceSchema),
    defaultValues: {
      employeeEmail: "",
    },
  });

  React.useEffect(() => {
    const fetchRecords = async () => {
      setIsLoadingRecords(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500)); 

      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      
      const lastMonthDate = new Date(today);
      lastMonthDate.setMonth(today.getMonth() - 1);
      lastMonthDate.setDate(5);

      const twoMonthsAgoDate = new Date(today);
      twoMonthsAgoDate.setMonth(today.getMonth() - 2);
      twoMonthsAgoDate.setDate(10);

      const mockData: MockAttendanceRecord[] = [
        { id: "1", employeeEmail: "user1@example.com", attendanceDate: format(today, "PPP"), status: "Present" },
        { id: "1a", employeeEmail: "user6@example.com", attendanceDate: format(today, "PPP"), status: "Present" },
        { id: "2", employeeEmail: "user2@example.com", attendanceDate: format(today, "PPP"), status: "Absent" },
        { id: "3", employeeEmail: "user3@example.com", attendanceDate: format(today, "PPP"), status: "On Leave" },
        { id: "4", employeeEmail: "user4@example.com", attendanceDate: format(today, "PPP"), status: "Present" },
        { id: "5", employeeEmail: "user5@example.com", attendanceDate: format(today, "PPP"), status: "Half Day" },
        
        { id: "6", employeeEmail: "user1@example.com", attendanceDate: format(yesterday, "PPP"), status: "Present" },
        { id: "7", employeeEmail: "user2@example.com", attendanceDate: format(yesterday, "PPP"), status: "Present" },
        { id: "7a", employeeEmail: "user3@example.com", attendanceDate: format(yesterday, "PPP"), status: "Half Day" },
        
        { id: "8", employeeEmail: "user4@example.com", attendanceDate: format(lastMonthDate, "PPP"), status: "Present" },
        { id: "9", employeeEmail: "user1@example.com", attendanceDate: format(lastMonthDate, "PPP"), status: "Absent" },
        { id: "10", employeeEmail: "user2@example.com", attendanceDate: format(lastMonthDate, "PPP"), status: "On Leave" },
        { id: "11", employeeEmail: "user5@example.com", attendanceDate: format(lastMonthDate, "PPP"), status: "Present" },
        { id: "11a", employeeEmail: "user6@example.com", attendanceDate: format(lastMonthDate, "PPP"), status: "Half Day" },
        
        { id: "12", employeeEmail: "user3@example.com", attendanceDate: format(twoMonthsAgoDate, "PPP"), status: "Present" },
        { id: "13", employeeEmail: "user4@example.com", attendanceDate: format(twoMonthsAgoDate, "PPP"), status: "Absent" },
        { id: "14", employeeEmail: "user1@example.com", attendanceDate: format(twoMonthsAgoDate, "PPP"), status: "Present" },
      ];
      setAttendanceRecords(mockData);
      setIsLoadingRecords(false);
    };
    fetchRecords();
  }, []);

  const onManualSubmit = (data: ManualAttendanceFormValues) => {
    const newRecord: MockAttendanceRecord = {
        id: String(Date.now()), 
        employeeEmail: data.employeeEmail,
        attendanceDate: format(data.attendanceDate, "PPP"),
        status: data.status,
    }
    setAttendanceRecords(prevRecords => [newRecord, ...prevRecords].sort((a, b) => parse(b.attendanceDate, "PPP", new Date()).getTime() - parse(a.attendanceDate, "PPP", new Date()).getTime()));

    toast({
      title: "Attendance Recorded",
      description: `Attendance for ${data.employeeEmail} on ${format(data.attendanceDate, "PPP")} has been recorded as ${data.status}.`,
    });
    form.reset();
  };

  const dailySummary = React.useMemo<DailySummary>(() => {
    const today = new Date();
    const summary: DailySummary = { present: 0, absent: 0, onLeave: 0, halfDay: 0 };
    attendanceRecords.forEach(record => {
      if (isSameDay(parse(record.attendanceDate, "PPP", new Date()), today)) {
        if (record.status === "Present") summary.present++;
        else if (record.status === "Absent") summary.absent++;
        else if (record.status === "On Leave") summary.onLeave++;
        else if (record.status === "Half Day") summary.halfDay++;
      }
    });
    return summary;
  }, [attendanceRecords]);

  const historicalSummary = React.useMemo<MonthlySummary>(() => {
    const summaryByMonth: Record<string, DailySummary & { count: number, year: number, monthNum: number }> = {};

    attendanceRecords.forEach(record => {
      const recordDate = parse(record.attendanceDate, "PPP", new Date());
      const monthKey = format(startOfMonth(recordDate), "yyyy-MM"); // Use yyyy-MM for sorting
      const displayMonth = format(startOfMonth(recordDate), "MMMM yyyy");


      if (!summaryByMonth[monthKey]) {
        summaryByMonth[monthKey] = { present: 0, absent: 0, onLeave: 0, halfDay: 0, count: 0, year: getYear(recordDate), monthNum: getMonth(recordDate) };
      }

      if (record.status === "Present") summaryByMonth[monthKey].present++;
      else if (record.status === "Absent") summaryByMonth[monthKey].absent++;
      else if (record.status === "On Leave") summaryByMonth[monthKey].onLeave++;
      else if (record.status === "Half Day") summaryByMonth[monthKey].halfDay++;
      summaryByMonth[monthKey].count++;
    });
    
    return Object.entries(summaryByMonth)
      .map(([key, data]) => ({ 
        month: format(new Date(data.year, data.monthNum), "MMMM yyyy"), // Format for display
        year: data.year,
        monthKey: key,
        ...data 
      }))
      .sort((a,b) => new Date(b.year, getMonth(parse(b.month, "MMMM yyyy", new Date()))).getTime() - new Date(a.year, getMonth(parse(a.month, "MMMM yyyy", new Date()))).getTime());
  }, [attendanceRecords]);

  const handleDailySummaryItemClick = (status: MockAttendanceRecord['status']) => {
    const today = new Date();
    const records = attendanceRecords
      .filter(r => isSameDay(parse(r.attendanceDate, "PPP", new Date()), today) && r.status === status)
      .map(r => ({ employeeEmail: r.employeeEmail, status: r.status }));
    setDailyDetailDialogTitle(`${status} Today (${format(today, "PPP")})`);
    setDailyDetailDialogRecords(records);
    setIsDailyDetailDialogOpen(true);
  };
  
  const handleMonthlySummaryItemClick = (monthData: MonthlySummaryItem) => {
    const records = attendanceRecords.filter(r => {
        const recordDate = parse(r.attendanceDate, "PPP", new Date());
        return isSameMonth(recordDate, parse(monthData.month, "MMMM yyyy", new Date())) && getYear(recordDate) === monthData.year;
    });
    setMonthlyDetailDialogTitle(`Attendance for ${monthData.month}`);
    setMonthlyDetailDialogRecords(records);
    setIsMonthlyDetailDialogOpen(true);
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

        <Dialog open={isDailyDetailDialogOpen} onOpenChange={setIsDailyDetailDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-primary">{dailyDetailDialogTitle}</DialogTitle>
              <DialogDescription>List of employees for the selected status today.</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh]">
            {dailyDetailDialogRecords.length > 0 ? (
              <ul className="space-y-2 py-4">
                {dailyDetailDialogRecords.map((record, index) => (
                  <li key={index} className="text-sm text-foreground p-2 bg-input/50 rounded-md">
                    {record.employeeEmail}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-4">No records found for this status today.</p>
            )}
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <Dialog open={isMonthlyDetailDialogOpen} onOpenChange={setIsMonthlyDetailDialogOpen}>
          <DialogContent className="sm:max-w-md md:max-w-lg bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-primary">{monthlyDetailDialogTitle}</DialogTitle>
              <DialogDescription>All attendance records for the selected month.</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh]">
              {monthlyDetailDialogRecords.length > 0 ? (
                <Table className="mt-2">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee Email</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyDetailDialogRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.employeeEmail}</TableCell>
                        <TableCell>{record.attendanceDate}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            record.status === "Present" ? "bg-green-500/20 text-green-400" :
                            record.status === "Absent" ? "bg-red-500/20 text-red-400" :
                            record.status === "On Leave" ? "bg-yellow-500/20 text-yellow-400" :
                            "bg-blue-500/20 text-blue-400" // Half Day
                          }`}>
                            {record.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-center py-4">No records found for this month.</p>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>

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
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
                              disabled={(date) => date > new Date() || date < new Date("2000-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
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
                  {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Save Attendance"}
                   {!form.formState.isSubmitting && <CheckCircle className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-8">
            <Card className="shadow-xl rounded-md border border-border/60 bg-card hover:border-primary/70 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fade-in-slide-up">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-semibold text-primary">Daily Check-ins Overview</CardTitle>
                    <Eye className="h-8 w-8 text-accent" />
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-sm text-muted-foreground mb-4">
                        Summary for today, {format(new Date(), "PPP")}. Click a status to view details.
                    </CardDescription>
                    {isLoadingRecords ? (
                        <div className="flex items-center justify-center h-24">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <Button variant="ghost" className="w-full justify-between p-2 h-auto hover:bg-input/70" onClick={() => handleDailySummaryItemClick("Present")}>
                                <div className="flex items-center">
                                    <UserCheck className="h-5 w-5 text-green-500 mr-2" />
                                    <span className="text-foreground">Present</span>
                                </div>
                                <span className="font-semibold text-foreground">{dailySummary.present}</span>
                            </Button>
                             <Button variant="ghost" className="w-full justify-between p-2 h-auto hover:bg-input/70" onClick={() => handleDailySummaryItemClick("Absent")}>
                                <div className="flex items-center">
                                    <UserX className="h-5 w-5 text-red-500 mr-2" />
                                    <span className="text-foreground">Absent</span>
                                </div>
                                <span className="font-semibold text-foreground">{dailySummary.absent}</span>
                            </Button>
                            <Button variant="ghost" className="w-full justify-between p-2 h-auto hover:bg-input/70" onClick={() => handleDailySummaryItemClick("On Leave")}>
                                <div className="flex items-center">
                                    <PlaneTakeoff className="h-5 w-5 text-yellow-500 mr-2" />
                                    <span className="text-foreground">On Leave</span>
                                </div>
                                <span className="font-semibold text-foreground">{dailySummary.onLeave}</span>
                            </Button>
                             <Button variant="ghost" className="w-full justify-between p-2 h-auto hover:bg-input/70" onClick={() => handleDailySummaryItemClick("Half Day")}>
                                <div className="flex items-center">
                                    <Users className="h-5 w-5 text-blue-500 mr-2" /> 
                                    <span className="text-foreground">Half Day</span>
                                </div>
                                <span className="font-semibold text-foreground">{dailySummary.halfDay}</span>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
            <Card className="shadow-xl rounded-md border border-border/60 bg-card hover:border-primary/70 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fade-in-slide-up">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-semibold text-primary">Historical Reports</CardTitle>
                    <History className="h-8 w-8 text-primary" />
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-sm text-muted-foreground mb-4">
                        Monthly attendance summaries. Click a month for details.
                    </CardDescription>
                     {isLoadingRecords ? (
                        <div className="flex items-center justify-center h-24">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    ) : historicalSummary.length > 0 ? (
                        <ScrollArea className="max-h-60 pr-2">
                        <div className="space-y-4">
                            {historicalSummary.map(monthData => (
                                <Button 
                                    key={monthData.monthKey} 
                                    variant="outline" 
                                    className="w-full p-3 rounded-md bg-input/50 border border-border/40 hover:bg-input/80 h-auto flex flex-col items-start text-left"
                                    onClick={() => handleMonthlySummaryItemClick(monthData)}
                                >
                                    <h3 className="font-semibold text-accent mb-2">{monthData.month}</h3>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm w-full">
                                        <div className="flex items-center justify-between"><span>Present:</span> <span className="font-medium">{monthData.present}</span></div>
                                        <div className="flex items-center justify-between"><span>Absent:</span> <span className="font-medium">{monthData.absent}</span></div>
                                        <div className="flex items-center justify-between"><span>On Leave:</span> <span className="font-medium">{monthData.onLeave}</span></div>
                                        <div className="flex items-center justify-between"><span>Half Day:</span> <span className="font-medium">{monthData.halfDay}</span></div>
                                    </div>
                                </Button>
                            ))}
                        </div>
                        </ScrollArea>
                    ) : (
                        <p className="text-muted-foreground text-center">No historical data available.</p>
                    )}
                </CardContent>
            </Card>
        </div>

        <Card className="mb-8 shadow-xl rounded-md border border-border/60 bg-card animate-fade-in-slide-up">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold text-primary">View All Attendance Records</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsAllRecordsTableExpanded(prev => !prev)} className="text-accent hover:text-accent/80">
                {isAllRecordsTableExpanded ? <Minimize2 className="h-6 w-6" /> : <Maximize2 className="h-6 w-6" />}
                <span className="sr-only">{isAllRecordsTableExpanded ? "Collapse Table" : "Expand Table"}</span>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoadingRecords ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-3 text-muted-foreground">Loading records...</p>
              </div>
            ) : attendanceRecords.length > 0 ? (
              <ScrollArea className={!isAllRecordsTableExpanded ? "max-h-96" : ""}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee Email</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.employeeEmail}</TableCell>
                        <TableCell>{record.attendanceDate}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            record.status === "Present" ? "bg-green-500/20 text-green-400" :
                            record.status === "Absent" ? "bg-red-500/20 text-red-400" :
                            record.status === "On Leave" ? "bg-yellow-500/20 text-yellow-400" :
                            "bg-blue-500/20 text-blue-400" // Half Day
                          }`}>
                            {record.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            ) : (
              <p className="text-center text-muted-foreground h-40 flex items-center justify-center">No attendance records found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}


    