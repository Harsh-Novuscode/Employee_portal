
"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, UserCircle, Mail, Briefcase, Workflow, Laptop, MousePointer, Keyboard, Smartphone, HardDrive, Package, CalendarDays } from "lucide-react"; // Updated MousePointer
import { format, parseISO } from 'date-fns';

// Mock Data - In a real app, this would come from an API
interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: "Active" | "On Leave" | "Terminated";
  avatarUrl?: string; // Optional
}

const mockEmployees: Employee[] = [
  { id: "emp001", name: "Dr. Evelyn Reed", email: "e.reed@aicorp.com", department: "AI Research", role: "Lead Scientist", status: "Active", avatarUrl: "https://placehold.co/128x128/A78BFA/FFFFFF.png?text=ER" },
  { id: "emp002", name: "Marcus Chen", email: "m.chen@aicorp.com", department: "Engineering", role: "Software Engineer", status: "Active", avatarUrl: "https://placehold.co/128x128/60A5FA/FFFFFF.png?text=MC" },
  { id: "emp003", name: "Aisha Khan", email: "a.khan@aicorp.com", department: "Product", role: "Product Manager", status: "Active", avatarUrl: "https://placehold.co/128x128/F472B6/FFFFFF.png?text=AK" },
  { id: "emp004", name: "Leo Maxwell", email: "l.maxwell@aicorp.com", department: "Operations", role: "System Administrator", status: "On Leave" },
  { id: "emp005", name: "Sophia Miller", email: "s.miller@aicorp.com", department: "Data Science", role: "Data Analyst", status: "Active", avatarUrl: "https://placehold.co/128x128/34D399/FFFFFF.png?text=SM" },
];

interface AssetSpecification {
  key: string;
  value: string;
}

interface EmployeeAsset {
  assetId: string;
  type: "Laptop" | "Monitor" | "Mouse" | "Keyboard" | "Smartphone" | "Other";
  name: string; // e.g. "MacBook Pro 16-inch"
  make: string;
  model: string;
  serialNumber?: string;
  specifications: AssetSpecification[];
  assignedDate: string; // ISO string date
  purchaseDate?: string; // ISO string date
}

const employeeAssetsData: Record<string, EmployeeAsset[]> = {
  "emp001": [
    { assetId: "lap001", type: "Laptop", name: "Dev Laptop XPS-15", make: "Dell", model: "XPS 15 9520", serialNumber: "SN-XPS15-001", specifications: [{key: "CPU", value: "Intel Core i9-12900HK"}, {key: "RAM", value: "64GB DDR5"}, {key: "Storage", value: "2TB NVMe SSD"}, {key: "GPU", value: "NVIDIA GeForce RTX 3050 Ti"}], assignedDate: "2023-01-10T00:00:00.000Z", purchaseDate: "2022-12-15T00:00:00.000Z" },
    { assetId: "mon001", type: "Monitor", name: "Primary Monitor U2723QE", make: "Dell", model: "UltraSharp U2723QE", specifications: [{key: "Size", value: "27-inch"}, {key: "Resolution", value: "3840x2160 (4K)"}, {key: "Panel", value: "IPS Black"}], assignedDate: "2023-01-10T00:00:00.000Z" },
    { assetId: "mou001", type: "Mouse", name: "MX Master 3S", make: "Logitech", model: "MX Master 3S", specifications: [{key: "Connectivity", value: "Bluetooth, Logi Bolt"}, {key: "DPI", value: "8000"}], assignedDate: "2023-01-10T00:00:00.000Z" },
    { assetId: "kbd002", type: "Keyboard", name: "MX Keys", make: "Logitech", model: "MX Keys", specifications: [{key: "Type", value: "Wireless"}, {key: "Backlight", value: "Yes"}], assignedDate: "2023-01-10T00:00:00.000Z" },
    { assetId: "phn002", type: "Smartphone", name: "iPhone 15 Pro", make: "Apple", model: "iPhone 15 Pro", specifications: [{key: "Storage", value: "512GB"}, {key: "Color", value: "Titanium Blue"}], assignedDate: "2023-09-20T00:00:00.000Z" },
     { assetId: "oth001", type: "Other", name: "Docking Station WD19S", make: "Dell", model: "WD19S", specifications: [{key: "Ports", value: "USB-C, HDMI, DP, Ethernet"}], assignedDate: "2023-01-10T00:00:00.000Z" },
  ],
  "emp002": [
    { assetId: "lap002", type: "Laptop", name: "Zenbook Pro Duo", make: "ASUS", model: "UX582", serialNumber: "SN-ZENBOOK-002", specifications: [{key: "CPU", value: "Intel Core i7-11800H"}, {key: "RAM", value: "32GB DDR4"}, {key: "Storage", value: "1TB PCIe SSD"}, {key: "Display", value: "Dual Screen"}], assignedDate: "2023-03-15T00:00:00.000Z" },
    { assetId: "kbd001", type: "Keyboard", name: "Mechanical Keyboard K2", make: "Keychron", model: "K2 (Version 2)", specifications: [{key: "Switch Type", value: "Gateron Brown"}, {key: "Layout", value: "75%"}], assignedDate: "2023-03-15T00:00:00.000Z" },
  ],
  "emp005": [
    { assetId: "lap003", type: "Laptop", name: "Surface Laptop 4", make: "Microsoft", model: "Surface Laptop 4", specifications: [{key: "CPU", value: "AMD Ryzen 7 4980U"}, {key: "RAM", value: "16GB LPDDR4x"}, {key: "Storage", value: "512GB SSD"}], assignedDate: "2022-08-20T00:00:00.000Z" },
    { assetId: "phn001", type: "Smartphone", name: "Pixel 7 Pro", make: "Google", model: "Pixel 7 Pro", specifications: [{key: "Storage", value: "256GB"}, {key: "Color", value: "Obsidian"}], assignedDate: "2023-05-01T00:00:00.000Z" },
  ],
};

const getAssetIcon = (type: EmployeeAsset["type"]) => {
  switch (type) {
    case "Laptop": return <Laptop className="h-5 w-5 text-primary" />;
    case "Monitor": return <HardDrive className="h-5 w-5 text-primary" />; // Using HardDrive as a proxy for Monitor chassis
    case "Mouse": return <MousePointer className="h-5 w-5 text-primary" />;
    case "Keyboard": return <Keyboard className="h-5 w-5 text-primary" />;
    case "Smartphone": return <Smartphone className="h-5 w-5 text-primary" />;
    default: return <Package className="h-5 w-5 text-primary" />;
  }
};

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.employeeId as string;

  const [employee, setEmployee] = React.useState<Employee | null>(null);
  const [assets, setAssets] = React.useState<EmployeeAsset[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    const timer = setTimeout(() => {
      const foundEmployee = mockEmployees.find(emp => emp.id === employeeId);
      if (foundEmployee) {
        setEmployee(foundEmployee);
        setAssets(employeeAssetsData[employeeId] || []);
      } else {
        // Handle not found, maybe redirect or show error
        router.push("/dashboard/employees"); // For now, redirect if not found
      }
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [employeeId, router]);

  const getStatusBadgeClasses = (status?: Employee["status"]) => {
    if (!status) return "";
    switch (status) {
      case "Active": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "On Leave": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Terminated": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "border-transparent";
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="ml-3 text-muted-foreground text-lg">Loading employee data...</p>
        </div>
      </MainLayout>
    );
  }

  if (!employee) {
    return (
      <MainLayout>
        <div className="text-center py-10">
          <h1 className="text-2xl font-semibold text-destructive">Employee Not Found</h1>
          <Button onClick={() => router.push("/dashboard/employees")} variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Employees List
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="w-full animate-fade-in-slide-up">
        <Button onClick={() => router.push("/dashboard/employees")} variant="outline" className="mb-6 group">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Employees List
        </Button>

        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
            {employee.name}
          </h1>
          <p className="text-muted-foreground">Detailed information and assigned assets.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 shadow-xl rounded-md border border-border/60 bg-card hover:border-primary/70 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5">
            <CardHeader className="items-center">
              {employee.avatarUrl ? (
                <img src={employee.avatarUrl} alt={employee.name} data-ai-hint="employee avatar" className="h-32 w-32 rounded-full border-4 border-primary/50 object-cover shadow-lg" />
              ) : (
                <UserCircle className="h-32 w-32 text-primary/70" />
              )}
              <CardTitle className="text-2xl text-primary mt-4">{employee.name}</CardTitle>
              <Badge variant="outline" className={`mt-1 text-xs ${getStatusBadgeClasses(employee.status)}`}>{employee.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center">
                <Mail className="mr-3 h-4 w-4 text-muted-foreground" />
                <span className="text-foreground/90">{employee.email}</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="mr-3 h-4 w-4 text-muted-foreground" />
                <span className="text-foreground/90">{employee.department}</span>
              </div>
              <div className="flex items-center">
                <Workflow className="mr-3 h-4 w-4 text-muted-foreground" />
                <span className="text-foreground/90">{employee.role}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 shadow-xl rounded-md border border-border/60 bg-card hover:border-primary/70 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-primary">Assigned Assets</CardTitle>
              <CardDescription>List of equipment and resources assigned to {employee.name}.</CardDescription>
            </CardHeader>
            <CardContent>
              {assets.length > 0 ? (
                <ScrollArea className="max-h-[60vh] pr-2">
                  <div className="space-y-4">
                    {assets.map((asset) => (
                      <div key={asset.assetId} className="p-4 rounded-md border border-border/40 bg-input/30 hover:bg-input/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            {getAssetIcon(asset.type)}
                            <h3 className="ml-2 text-lg font-semibold text-accent">{asset.name}</h3>
                          </div>
                          <Badge variant="secondary" className="text-xs">{asset.type}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">Make: {asset.make} | Model: {asset.model} {asset.serialNumber && `| S/N: ${asset.serialNumber}`}</p>
                         <p className="text-xs text-muted-foreground mb-3">
                           <CalendarDays className="inline-block mr-1.5 h-3.5 w-3.5" />
                           Assigned: {format(parseISO(asset.assignedDate), "PPP")} 
                           {asset.purchaseDate && ` (Purchased: ${format(parseISO(asset.purchaseDate), "PPP")})`}
                         </p>
                        
                        <h4 className="text-sm font-medium text-foreground/80 mb-1.5">Specifications:</h4>
                        <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground pl-1">
                          {asset.specifications.map(spec => (
                            <li key={spec.key}><span className="font-medium text-foreground/70">{spec.key}:</span> {spec.value}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex items-center justify-center h-40 rounded-md bg-input/50 border border-dashed border-border">
                  <p className="text-muted-foreground">No assets currently assigned to this employee.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

    