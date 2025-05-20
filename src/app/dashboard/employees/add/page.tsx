
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Save, XCircle, User, Mail, Briefcase, Workflow, CircleDot, Loader2, CheckCircle } from "lucide-react";

const employeeSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  department: z.string().min(2, { message: "Department is required." }),
  role: z.string().min(2, { message: "Role is required." }),
  status: z.enum(["Active", "On Leave", "Terminated"], { required_error: "Status is required." }),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

const employeeStatuses: EmployeeFormValues["status"][] = ["Active", "On Leave", "Terminated"];

export default function AddEmployeePage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      email: "",
      department: "",
      role: "",
      status: "Active",
    },
  });

  const onSubmit = async (data: EmployeeFormValues) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("New Employee Data:", data);

    toast({
      title: "Employee Added",
      description: `${data.name} has been successfully added to the system.`,
    });
    router.push("/dashboard/employees");
  };

  return (
    <MainLayout>
      <div className="w-full max-w-2xl mx-auto animate-fade-in-slide-up">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
            Add New Employee
          </h1>
          <p className="text-muted-foreground">Enter the details for the new personnel.</p>
        </header>

        <Card className="shadow-xl rounded-md border border-border/60 bg-card hover:border-primary/70 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5">
          <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-primary">Employee Information</CardTitle>
                <UserPlus className="h-7 w-7 text-accent" />
            </div>
            <CardDescription>Fill out the form below to add a new employee.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><User className="mr-2 h-4 w-4 text-muted-foreground" />Full Name</FormLabel>
                      <FormControl><Input placeholder="e.g., John Doe" {...field} className="bg-input focus:bg-input/70" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground" />Email Address</FormLabel>
                      <FormControl><Input type="email" placeholder="e.g., j.doe@aicorp.com" {...field} className="bg-input focus:bg-input/70" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="flex items-center"><Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />Department</FormLabel>
                        <FormControl><Input placeholder="e.g., Engineering" {...field} className="bg-input focus:bg-input/70" /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="flex items-center"><Workflow className="mr-2 h-4 w-4 text-muted-foreground" />Role / Position</FormLabel>
                        <FormControl><Input placeholder="e.g., Software Engineer" {...field} className="bg-input focus:bg-input/70" /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><CircleDot className="mr-2 h-4 w-4 text-muted-foreground" />Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger className="bg-input focus:bg-input/70"><SelectValue placeholder="Select employee status" /></SelectTrigger></FormControl>
                        <SelectContent className="bg-card border-border text-card-foreground">
                          {employeeStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-end space-x-3 border-t border-border/30 pt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push("/dashboard/employees")}
                  className="hover:bg-muted/30"
                  disabled={form.formState.isSubmitting}
                >
                  <XCircle className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/80 text-primary-foreground font-semibold py-2.5 px-6 rounded-sm shadow-md hover:shadow-primary/40 transition-all duration-300 ease-out group hover:scale-[1.02] hover:-translate-y-0.5"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4"/>}
                  {form.formState.isSubmitting ? "Saving..." : "Save Employee"}
                  {!form.formState.isSubmitting && <CheckCircle className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </MainLayout>
  );
}

