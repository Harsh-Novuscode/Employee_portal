
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UsersRound, Briefcase, Mail, Workflow, CircleDot, Eye, FilePenLine, Trash2, UserPlus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: "Active" | "On Leave" | "Terminated";
}

const mockEmployees: Employee[] = [
  { id: "emp001", name: "Dr. Evelyn Reed", email: "e.reed@aicorp.com", department: "AI Research", role: "Lead Scientist", status: "Active" },
  { id: "emp002", name: "Marcus Chen", email: "m.chen@aicorp.com", department: "Engineering", role: "Software Engineer", status: "Active" },
  { id: "emp003", name: "Aisha Khan", email: "a.khan@aicorp.com", department: "Product", role: "Product Manager", status: "Active" },
  { id: "emp004", name: "Leo Maxwell", email: "l.maxwell@aicorp.com", department: "Operations", role: "System Administrator", status: "On Leave" },
  { id: "emp005", name: "Sophia Miller", email: "s.miller@aicorp.com", department: "Data Science", role: "Data Analyst", status: "Active" },
  { id: "emp006", name: "Kenji Tanaka", email: "k.tanaka@aicorp.com", department: "Engineering", role: "Senior Developer", status: "Active" },
  { id: "emp007", name: "Isabelle Moreau", email: "i.moreau@aicorp.com", department: "AI Ethics", role: "Ethics Officer", status: "Active" },
  { id: "emp008", name: "David Kim", email: "d.kim@aicorp.com", department: "HR", role: "HR Specialist", status: "Terminated" },
  { id: "emp009", name: "Chloe Davis", email: "c.davis@aicorp.com", department: "Marketing", role: "Marketing Lead", status: "Active" },
  { id: "emp010", name: "Raj Patel", email: "r.patel@aicorp.com", department: "Engineering", role: "DevOps Engineer", status: "Active" },
  { id: "emp011", name: "Olivia Garcia", email: "o.garcia@aicorp.com", department: "AI Research", role: "Research Assistant", status: "Active" },
  { id: "emp012", name: "Noah Smith", email: "n.smith@aicorp.com", department: "Engineering", role: "Junior Developer", status: "On Leave" },
  { id: "emp013", name: "Emma Wilson", email: "e.wilson@aicorp.com", department: "Product", role: "UX Designer", status: "Active" },
  { id: "emp014", name: "Liam Brown", email: "l.brown@aicorp.com", department: "Operations", role: "IT Support", status: "Active" },
  { id: "emp015", name: "Ava Jones", email: "a.jones@aicorp.com", department: "Data Science", role: "Machine Learning Engineer", status: "Terminated" },
  // Adding more employees to ensure scrollbar visibility
  { id: "emp016", name: "James White", email: "j.white@aicorp.com", department: "Engineering", role: "QA Engineer", status: "Active" },
  { id: "emp017", name: "Mia Harris", email: "m.harris@aicorp.com", department: "Marketing", role: "Content Creator", status: "Active" },
  { id: "emp018", name: "Ethan Clark", email: "e.clark@aicorp.com", department: "AI Research", role: "Researcher", status: "On Leave" },
  { id: "emp019", name: "Isabella Lewis", email: "i.lewis@aicorp.com", department: "Product", role: "UI Designer", status: "Active" },
  { id: "emp020", name: "Alexander Walker", email: "a.walker@aicorp.com", department: "Operations", role: "Network Engineer", status: "Active" },
  { id: "emp021", name: "Charlotte Hall", email: "c.hall@aicorp.com", department: "Data Science", role: "Data Scientist", status: "Active" },
  { id: "emp022", name: "Daniel Allen", email: "d.allen@aicorp.com", department: "Engineering", role: "Backend Developer", status: "Terminated" },
  { id: "emp023", name: "Grace Young", email: "g.young@aicorp.com", department: "HR", role: "Recruiter", status: "Active" },
  { id: "emp024", name: "Henry King", email: "h.king@aicorp.com", department: "Marketing", role: "SEO Specialist", status: "On Leave" },
  { id: "emp025", name: "Sofia Scott", email: "s.scott@aicorp.com", department: "AI Ethics", role: "Policy Analyst", status: "Active" },
  { id: "emp026", name: "William Green", email: "w.green@aicorp.com", department: "Engineering", role: "Frontend Developer", status: "Active" },
  { id: "emp027", name: "Ella Adams", email: "e.adams@aicorp.com", department: "Product", role: "Business Analyst", status: "Active" },
  { id: "emp028", name: "Benjamin Baker", email: "b.baker@aicorp.com", department: "Operations", role: "Security Analyst", status: "Active" },
  { id: "emp029", name: "Lily Nelson", email: "l.nelson@aicorp.com", department: "Data Science", role: "BI Developer", status: "Terminated" },
  { id: "emp030", name: "Samuel Carter", email: "s.carter@aicorp.com", department: "AI Research", role: "AI Engineer", status: "Active" },
];

export default function EmployeesPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setEmployees(mockEmployees);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const getStatusBadgeClasses = (status: Employee["status"]) => {
    switch (status) {
      case "Active": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "On Leave": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Terminated": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "border-transparent";
    }
  };

  const handleEdit = (employee: Employee) => {
    toast({
      title: "Edit Action",
      description: `Editing ${employee.name} (Not implemented).`,
    });
  };

  const handleDelete = (employee: Employee) => {
    toast({
      variant: "destructive",
      title: "Delete Action",
      description: `Deleting ${employee.name} (Not implemented).`,
    });
  };

  return (
    <MainLayout>
      <div className="w-full animate-fade-in-slide-up">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
            Employee Roster
          </h1>
          <p className="text-muted-foreground">View and manage employee details within the AI Command Center.</p>
        </header>

        <Card className="shadow-xl rounded-md border border-border/60 bg-card hover:border-primary/70 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="space-y-1">
              <CardTitle className="text-xl font-semibold text-primary">Employee Database</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                A comprehensive list of all personnel integrated into the system.
              </CardDescription>
            </div>
            <Button onClick={() => router.push('/dashboard/employees/add')} className="bg-primary hover:bg-primary/80">
              <UserPlus className="mr-2 h-4 w-4" /> Add New Employee
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <div className="flex items-center justify-center h-60">
                    <Loader2 className="animate-spin h-8 w-8 text-primary" />
                    <p className="ml-3 text-muted-foreground">Loading employee data...</p>
                </div>
            ) : employees.length > 0 ? (
              <ScrollArea className="max-h-96 rounded-md border border-border/30">
                <Table>
                  <TableHeader className="sticky top-0 bg-card/95 backdrop-blur-sm z-10">
                    <TableRow>
                      <TableHead className="w-[200px]"><UsersRound className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Name</TableHead>
                      <TableHead><Mail className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Email</TableHead>
                      <TableHead><Briefcase className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Department</TableHead>
                      <TableHead><Workflow className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Role</TableHead>
                      <TableHead className="text-center"><CircleDot className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Status</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee.id} className="hover:bg-muted/20 transition-colors">
                        <TableCell className="font-medium">
                          <Link href={`/dashboard/employees/${employee.id}`} className="text-primary hover:underline hover:text-accent transition-colors">
                            {employee.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">{employee.email}</TableCell>
                        <TableCell className="text-muted-foreground">{employee.department}</TableCell>
                        <TableCell className="text-muted-foreground">{employee.role}</TableCell>
                        <TableCell className="text-center">
                          <Badge 
                            variant="outline"
                            className={`text-xs px-2 py-0.5 ${getStatusBadgeClasses(employee.status)}`}
                          >
                            {employee.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center space-x-1">
                          <Link href={`/dashboard/employees/${employee.id}`} passHref>
                            <button className="p-1.5 text-primary hover:text-accent rounded-md hover:bg-primary/10 transition-all" aria-label={`View details for ${employee.name}`}>
                              <Eye className="h-4 w-4" />
                            </button>
                          </Link>
                          <button 
                            onClick={() => handleEdit(employee)} 
                            className="p-1.5 text-blue-400 hover:text-blue-300 rounded-md hover:bg-blue-500/10 transition-all" 
                            aria-label={`Edit ${employee.name}`}
                          >
                            <FilePenLine className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(employee)} 
                            className="p-1.5 text-red-400 hover:text-red-300 rounded-md hover:bg-red-500/10 transition-all" 
                            aria-label={`Delete ${employee.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            ) : (
              <div className="mt-4 h-60 rounded-md bg-input/50 flex items-center justify-center border border-dashed border-border">
                <p className="text-muted-foreground text-sm">No employee data found or unable to load.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
    
