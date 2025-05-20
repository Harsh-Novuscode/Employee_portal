
"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, UserCircle, Mail, Briefcase, Workflow, Laptop, MousePointer, Keyboard, Smartphone, HardDrive, Package, CalendarDays, PackagePlus, Tag, Building, Barcode, CalendarPlus, ListTree, CheckCircle, Loader2 } from "lucide-react";
import { format, parseISO } from 'date-fns';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";


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
  type: "Laptop" | "Monitor" | "Mouse" | "Keyboard" | "Smartphone" | "Webcam" | "Other";
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
    { assetId: "mon002", type: "Monitor", name: "Secondary Monitor P2419H", make: "Dell", model: "P2419H", specifications: [{key: "Size", value: "24-inch"}, {key: "Resolution", value: "1920x1080 (FHD)"}, {key: "Panel", value: "IPS"}], assignedDate: "2023-01-15T00:00:00.000Z" },
    { assetId: "web001", type: "Webcam", name: "C920 Pro HD Webcam", make: "Logitech", model: "C920", specifications: [{key: "Resolution", value: "1080p"}, {key: "Focus", value: "Autofocus"}], assignedDate: "2023-01-10T00:00:00.000Z" },
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

const assetTypes: EmployeeAsset["type"][] = ["Laptop", "Monitor", "Mouse", "Keyboard", "Smartphone", "Webcam", "Other"];

const assetFormSchema = z.object({
  type: z.enum(assetTypes, { required_error: "Asset type is required." }),
  name: z.string().min(3, { message: "Asset name must be at least 3 characters." }),
  make: z.string().min(2, { message: "Make is required." }),
  model: z.string().min(1, { message: "Model is required." }),
  serialNumber: z.string().optional(),
  assignedDate: z.date({ required_error: "Assigned date is required." }),
  purchaseDate: z.date().optional(),
  specificationsText: z.string().optional(), // Used for Textarea input
});

type AssetFormValues = z.infer<typeof assetFormSchema>;

const getAssetIcon = (type: EmployeeAsset["type"]) => {
  switch (type) {
    case "Laptop": return <Laptop className="h-5 w-5 text-primary" />;
    case "Monitor": return <HardDrive className="h-5 w-5 text-primary" />;
    case "Mouse": return <MousePointer className="h-5 w-5 text-primary" />;
    case "Keyboard": return <Keyboard className="h-5 w-5 text-primary" />;
    case "Smartphone": return <Smartphone className="h-5 w-5 text-primary" />;
    case "Webcam": return <Package className="h-5 w-5 text-primary" />; 
    default: return <Package className="h-5 w-5 text-primary" />;
  }
};

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const employeeId = params.employeeId as string;

  const [employee, setEmployee] = React.useState<Employee | null>(null);
  const [assets, setAssets] = React.useState<EmployeeAsset[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const assetForm = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      type: "Laptop",
      name: "",
      make: "",
      model: "",
      serialNumber: "",
      specificationsText: "",
    },
  });

  React.useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    const timer = setTimeout(() => {
      const foundEmployee = mockEmployees.find(emp => emp.id === employeeId);
      if (foundEmployee) {
        setEmployee(foundEmployee);
        setAssets(employeeAssetsData[employeeId] || []);
      } else {
        // Handle employee not found, e.g., redirect or show error
        router.push("/dashboard/employees"); // Or a 404 page
      }
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [employeeId, router]);

  const onSubmitAsset = (data: AssetFormValues) => {
    const newAsset: EmployeeAsset = {
      assetId: `asset-${Date.now()}`, // Simple unique ID
      type: data.type,
      name: data.name,
      make: data.make,
      model: data.model,
      serialNumber: data.serialNumber || undefined,
      assignedDate: data.assignedDate.toISOString(),
      purchaseDate: data.purchaseDate ? data.purchaseDate.toISOString() : undefined,
      specifications: data.specificationsText 
        ? data.specificationsText.split('\n').map(line => {
            const [key, ...valueParts] = line.split(':');
            return { key: key.trim(), value: valueParts.join(':').trim() };
          }).filter(spec => spec.key && spec.value)
        : [],
    };

    setAssets(prevAssets => [newAsset, ...prevAssets].sort((a,b) => parseISO(b.assignedDate).getTime() - parseISO(a.assignedDate).getTime() ));
    assetForm.reset();
    toast({
      title: "Asset Assigned",
      description: `${data.name} has been assigned to ${employee?.name}.`,
    });
  };


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
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
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
          {/* Employee Info Card */}
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

          {/* Asset Management Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Assign New Asset Card */}
            <Card className="shadow-xl rounded-md border border-border/60 bg-card hover:border-primary/70 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5">
              <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-primary">Assign New Asset</CardTitle>
                    <PackagePlus className="h-7 w-7 text-accent" />
                </div>
                <CardDescription>Fill in the details to assign a new asset to {employee.name}.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...assetForm}>
                  <form onSubmit={assetForm.handleSubmit(onSubmitAsset)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={assetForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center"><Tag className="mr-2 h-4 w-4 text-muted-foreground" />Asset Name</FormLabel>
                            <FormControl><Input placeholder="e.g., MacBook Pro 16-inch" {...field} className="bg-input focus:bg-input/70" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={assetForm.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center"><ListTree className="mr-2 h-4 w-4 text-muted-foreground" />Asset Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger className="bg-input focus:bg-input/70"><SelectValue placeholder="Select asset type" /></SelectTrigger></FormControl>
                              <SelectContent className="bg-card border-border text-card-foreground">
                                {assetTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={assetForm.control}
                            name="make"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center"><Building className="mr-2 h-4 w-4 text-muted-foreground" />Make</FormLabel>
                                <FormControl><Input placeholder="e.g., Apple, Dell" {...field} className="bg-input focus:bg-input/70" /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={assetForm.control}
                            name="model"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center"><Package className="mr-2 h-4 w-4 text-muted-foreground" />Model</FormLabel>
                                <FormControl><Input placeholder="e.g., A2485, XPS 15" {...field} className="bg-input focus:bg-input/70" /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                     </div>
                      <FormField
                        control={assetForm.control}
                        name="serialNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center"><Barcode className="mr-2 h-4 w-4 text-muted-foreground" />Serial Number (Optional)</FormLabel>
                            <FormControl><Input placeholder="e.g., C02X1234J1G5" {...field} className="bg-input focus:bg-input/70" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={assetForm.control}
                        name="assignedDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="flex items-center"><CalendarPlus className="mr-2 h-4 w-4 text-muted-foreground" />Assigned Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal bg-input hover:bg-input/80", !field.value && "text-muted-foreground")}>
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={assetForm.control}
                        name="purchaseDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="flex items-center"><CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />Purchase Date (Optional)</FormLabel>
                             <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal bg-input hover:bg-input/80", !field.value && "text-muted-foreground")}>
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={assetForm.control}
                      name="specificationsText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center"><ListTree className="mr-2 h-4 w-4 text-muted-foreground" />Specifications / Notes (Optional)</FormLabel>
                          <FormControl><Textarea placeholder="e.g., RAM: 16GB, Storage: 512GB SSD, Color: Space Gray&#xA;Each specification on a new line, format: Key: Value" {...field} className="bg-input focus:bg-input/70 min-h-[100px]" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full md:w-auto bg-primary hover:bg-primary/80 text-primary-foreground font-semibold py-2.5 px-6 rounded-sm shadow-md hover:shadow-primary/40 transition-all duration-300 ease-out group hover:scale-[1.02] hover:-translate-y-0.5"
                      disabled={assetForm.formState.isSubmitting}
                    >
                      {assetForm.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Save Asset"}
                      {!assetForm.formState.isSubmitting && <CheckCircle className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Assigned Assets List Card */}
            <Card className="shadow-xl rounded-md border border-border/60 bg-card hover:border-primary/70 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary">Assigned Assets</CardTitle>
                <CardDescription>List of equipment and resources currently assigned to {employee.name}.</CardDescription>
              </CardHeader>
              <CardContent>
                {assets.length > 0 ? (
                  <ScrollArea className="max-h-96 pr-2">
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
                          
                          {asset.specifications.length > 0 && (
                            <>
                                <h4 className="text-sm font-medium text-foreground/80 mb-1.5">Specifications:</h4>
                                <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground pl-1">
                                {asset.specifications.map(spec => (
                                    <li key={spec.key}><span className="font-medium text-foreground/70">{spec.key}:</span> {spec.value}</li>
                                ))}
                                </ul>
                            </>
                          )}
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
      </div>
    </MainLayout>
  );
}


