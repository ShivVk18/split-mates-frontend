import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import api from "@/utils/AxiosInstance";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  BarChart3,
  MessageSquare,
  Send,
  Loader2,
  TrendingUp,
  Brain,
  Download,
  Users,
  Mail
} from "lucide-react";

import useSEO from "@/hooks/useSEO";

// Chart Colors
const COLORS = ["#EA580C", "#D97706", "#475569", "#78716C", "#52525B", "#71717A", "#27272A", "#A1A1AA"];

const ReportsPage = () => {
  useSEO({
    title: "AI Reports",
    description: "Get smart, automated AI financial insights, expense categorizations, and savings tips with SplitMates AI Auditing."
  });

  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [loadingGroups, setLoadingGroups] = useState(true);

  // Tab 1: Reports State
  const [reportData, setReportData] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  // Tab 2: Chat Assistant State
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      role: "model",
      text: "Hello! I'm your SplitMates AI Financial Assistant. Ask me anything about your expenses, group balances, or who owes whom!",
    },
  ]);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch user groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get("/groups/");
        if (response.data?.data?.groups) {
          setGroups(response.data.data.groups);
          if (response.data.data.groups.length > 0) {
            setSelectedGroupId(response.data.data.groups[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch groups:", err);
        toast.error("Failed to load groups");
      } finally {
        setLoadingGroups(false);
      }
    };
    fetchGroups();
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const reportRef = useRef(null);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    toast.loading("Generating PDF...", { id: "pdf-gen" });
    try {
      const { jsPDF } = await import("jspdf");
      const html2canvas = (await import("html2canvas")).default;
      
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          const styles = clonedDoc.querySelectorAll("style, link[rel='stylesheet']");
          styles.forEach(style => style.remove());

          const clonedElement = clonedDoc.querySelector('[data-report-container="true"]');
          if (clonedElement) {
            clonedElement.className = "p-8 bg-white text-slate-800 text-base space-y-4";
            clonedElement.style.fontFamily = "system-ui, -apple-system, sans-serif";
            clonedElement.style.color = "#1e293b";
            clonedElement.style.backgroundColor = "#ffffff";
            clonedElement.style.padding = "32px";
            clonedElement.style.fontSize = "15px";
            
            const allElements = clonedElement.getElementsByTagName("*");
            for (let el of allElements) {
              el.removeAttribute("class");
              const tagName = el.tagName.toUpperCase();
              if (tagName.startsWith("H")) {
                el.style.color = "#0f172a";
                el.style.fontWeight = "bold";
                el.style.marginTop = "20px";
                el.style.marginBottom = "8px";
                if (tagName === "H1") el.style.fontSize = "26px";
                else if (tagName === "H2") el.style.fontSize = "22px";
                else el.style.fontSize = "18px";
              } else if (tagName === "P") {
                el.style.color = "#334155";
                el.style.marginBottom = "12px";
                el.style.lineHeight = "1.6";
                el.style.fontSize = "15px";
              } else if (tagName === "LI") {
                el.style.color = "#334155";
                el.style.marginBottom = "6px";
                el.style.marginLeft = "20px";
                el.style.listStyleType = "disc";
                el.style.fontSize = "15px";
              } else if (tagName === "UL" || tagName === "OL") {
                el.style.marginBottom = "12px";
                el.style.paddingLeft = "16px";
              } else if (tagName === "STRONG") {
                el.style.fontWeight = "bold";
                el.style.color = "#0f172a";
              }
            }
          }
        }
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`${reportData.groupName.replace(/\s+/g, "_")}_Monthly_Report.pdf`);
      toast.success("PDF Downloaded successfully!", { id: "pdf-gen" });
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF", { id: "pdf-gen" });
    }
  };

  const [userReportData, setUserReportData] = useState(null);
  const [generatingUserReport, setGeneratingUserReport] = useState(false);
  const [sendingReportEmail, setSendingReportEmail] = useState(false);
  const userReportRef = useRef(null);

  const handleSendReportEmail = async () => {
    setSendingReportEmail(true);
    try {
      const response = await api.post("/ai/test-email");
      toast.success(response.data?.message || "Report email sent successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to send report email. Ensure EMAIL_USER & EMAIL_PASS are set in backend .env");
    } finally {
      setSendingReportEmail(false);
    }
  };

  const handleGenerateUserReport = async () => {
    setGeneratingUserReport(true);
    setUserReportData(null);
    try {
      const response = await api.get("/ai/user-report");
      if (response.data?.data) {
        setUserReportData(response.data.data);
        toast.success("Personal Wealth Audit generated!");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to generate personal report");
    } finally {
      setGeneratingUserReport(false);
    }
  };

  const handleDownloadUserPDF = async () => {
    if (!userReportRef.current) return;
    toast.loading("Generating Personal PDF...", { id: "user-pdf-gen" });
    try {
      const { jsPDF } = await import("jspdf");
      const html2canvas = (await import("html2canvas")).default;
      
      const element = userReportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          const styles = clonedDoc.querySelectorAll("style, link[rel='stylesheet']");
          styles.forEach(style => style.remove());

          const clonedElement = clonedDoc.querySelector('[data-user-report-container="true"]');
          if (clonedElement) {
            clonedElement.className = "p-8 bg-white text-slate-800 text-base space-y-4";
            clonedElement.style.fontFamily = "system-ui, -apple-system, sans-serif";
            clonedElement.style.color = "#1e293b";
            clonedElement.style.backgroundColor = "#ffffff";
            clonedElement.style.padding = "32px";
            clonedElement.style.fontSize = "15px";
            
            const allElements = clonedElement.getElementsByTagName("*");
            for (let el of allElements) {
              el.removeAttribute("class");
              const tagName = el.tagName.toUpperCase();
              if (tagName.startsWith("H")) {
                el.style.color = "#0f172a";
                el.style.fontWeight = "bold";
                el.style.marginTop = "20px";
                el.style.marginBottom = "8px";
                if (tagName === "H1") el.style.fontSize = "26px";
                else if (tagName === "H2") el.style.fontSize = "22px";
                else el.style.fontSize = "18px";
              } else if (tagName === "P") {
                el.style.color = "#334155";
                el.style.marginBottom = "12px";
                el.style.lineHeight = "1.6";
                el.style.fontSize = "15px";
              } else if (tagName === "LI") {
                el.style.color = "#334155";
                el.style.marginBottom = "6px";
                el.style.marginLeft = "20px";
                el.style.listStyleType = "disc";
                el.style.fontSize = "15px";
              } else if (tagName === "UL" || tagName === "OL") {
                el.style.marginBottom = "12px";
                el.style.paddingLeft = "16px";
              } else if (tagName === "STRONG") {
                el.style.fontWeight = "bold";
                el.style.color = "#0f172a";
              }
            }
          }
        }
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`Personal_Monthly_Wealth_Report.pdf`);
      toast.success("PDF Downloaded successfully!", { id: "user-pdf-gen" });
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF", { id: "user-pdf-gen" });
    }
  };

  // Generate AI monthly report
  const handleGenerateReport = async () => {
    if (!selectedGroupId) {
      toast.error("Please select a group first");
      return;
    }

    setGeneratingReport(true);
    setReportData(null);
    try {
      const response = await api.get(`/ai/report/${selectedGroupId}`);
      if (response.data?.data) {
        setReportData(response.data.data);
        toast.success("AI Insights Report generated!");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to generate report");
    } finally {
      setGeneratingReport(false);
    }
  };

  // Send message to AI assistant
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!chatMessage.trim() || sendingMessage) return;

    const userMsg = chatMessage.trim();
    setChatMessage("");
    
    // Add user message to local state
    setChatHistory((prev) => [...prev, { role: "user", text: userMsg }]);
    setSendingMessage(true);

    try {
      // Send chat history and current message to backend
      const response = await api.post("/ai/chat", {
        message: userMsg,
        history: chatHistory.slice(-6), // Send last 6 messages for context
      });

      if (response.data?.data?.reply) {
        setChatHistory((prev) => [
          ...prev,
          { role: "model", text: response.data.data.reply },
        ]);
      }
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "model",
          text: "Sorry, I ran into an error generating that response. Please make sure your GEMINI_API_KEY is configured in the backend `.env` file.",
        },
      ]);
    } finally {
      setSendingMessage(false);
    }
  };

  // Preset question chips
  const handlePresetQuestion = (question) => {
    setChatMessage(question);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
            Analytics & Insights
          </h1>
          <p className="text-xs text-muted-foreground">Get balance insights, custom spending reports, and budget tips</p>
        </div>
      </div>

      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-3 bg-muted p-1 rounded-xl h-11">
          <TabsTrigger value="reports" className="rounded-lg font-medium flex items-center justify-center gap-2 h-full py-0 cursor-pointer">
            <BarChart3 className="w-4 h-4" /> Group Reports
          </TabsTrigger>
          <TabsTrigger value="personal" className="rounded-lg font-medium flex items-center justify-center gap-2 h-full py-0 cursor-pointer">
            <TrendingUp className="w-4 h-4" /> Personal Report
          </TabsTrigger>
          <TabsTrigger value="chat" className="rounded-lg font-medium flex items-center justify-center gap-2 h-full py-0 cursor-pointer">
            <MessageSquare className="w-4 h-4" /> Chat Assistant
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: REPORTS */}
        <TabsContent value="reports" className="space-y-6 mt-6">
          <Card className="bg-card border-border shadow-xs">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground font-bold">
                <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                Select Group & Analyze
              </CardTitle>
              <CardDescription>Select a group to analyze spending data for the last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-center gap-4">
              {loadingGroups ? (
                <div className="flex items-center gap-2 text-muted-foreground py-2 text-xs">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading groups...
                </div>
              ) : groups.length === 0 ? (
                <p className="text-muted-foreground text-xs">You need to join or create a group first.</p>
              ) : (
                <>
                  <select
                    value={selectedGroupId}
                    onChange={(e) => setSelectedGroupId(e.target.value)}
                    className="w-full sm:w-72 px-4 py-2 border border-border rounded-xl text-xs bg-muted text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/15 cursor-pointer hover:bg-accent transition-all duration-150"
                  >
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    onClick={handleGenerateReport}
                    disabled={generatingReport}
                    className="w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90 font-bold rounded-full cursor-pointer px-5 text-xs h-9"
                  >
                    {generatingReport ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Generate Report
                      </>
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {generatingReport && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-2xl p-16 text-center space-y-6 shadow-xs"
            >
              <div className="relative flex items-center justify-center mx-auto w-16 h-16">
                <motion.div
                  animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                  className="absolute w-12 h-12 bg-orange-500/20 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.6], opacity: [0.8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut", delay: 0.35 }}
                  className="absolute w-12 h-12 bg-orange-500/30 rounded-full"
                />
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <Brain className="w-8 h-8 text-white animate-pulse" />
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-foreground">SplitMates AI is auditing ledger...</h4>
                <p className="text-[10px] text-muted-foreground max-w-sm mx-auto">Extracting monthly transaction records, analyzing categorizations, and compiling smart saving tips.</p>
              </div>
            </motion.div>
          )}

          {reportData && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Visual Stats */}
              <div className="lg:col-span-1 space-y-6">
                {/* Spend summary card */}
                <Card className="bg-card border-border shadow-xs">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">Total Spend (Last 30 Days)</h4>
                      <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">
                      {reportData.currency} {reportData.totalSpent.toLocaleString("en-IN")}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-2">Analyzed for group "{reportData.groupName}"</p>
                  </CardContent>
                </Card>
 
                {/* Category Pie Chart */}
                {reportData.categoryBreakdown?.length > 0 && (
                  <Card className="bg-card border-border shadow-xs">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-bold text-foreground">Category Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64 flex justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={reportData.categoryBreakdown}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={65}
                            fill="#8884d8"
                            labelLine={false}
                          >
                            {reportData.categoryBreakdown.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${reportData.currency} ${value}`} />
                          <Legend wrapperStyle={{ fontSize: "10px", marginTop: "10px" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}
 
                {/* Member Bar Chart */}
                {reportData.memberBreakdown?.length > 0 && (
                  <Card className="bg-card border-border shadow-xs">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-bold text-foreground">Member Payments</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64 flex justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={reportData.memberBreakdown}>
                          <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                          <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                          <Tooltip formatter={(value) => `${reportData.currency} ${value}`} />
                          <Bar dataKey="amount" fill="#EA580C" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}
              </div>
 
              {/* Markdown AI report */}
              <div className="lg:col-span-2">
                <Card className="bg-card border-border shadow-xs h-full flex flex-col">
                  <CardHeader className="border-b border-border flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-foreground font-bold">
                        <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        SplitMates Financial Insights
                      </CardTitle>
                      <CardDescription>Smart monthly audit summary and savings tips</CardDescription>
                    </div>
                    <Button
                      onClick={handleDownloadPDF}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1.5 text-xs border-border hover:bg-accent text-foreground font-medium py-1.5 px-3 rounded-full transition-all duration-200 active:scale-95 cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download PDF
                    </Button>
                  </CardHeader>
                  <CardContent className="flex-1 p-6 overflow-hidden flex flex-col min-h-0">
                    <ScrollArea className="flex-1 pr-4">
                      <div ref={reportRef} data-report-container="true" className="prose prose-slate max-w-none text-foreground text-xs leading-relaxed space-y-4">
                        {/* Report Header for PDF */}
                        <div className="border-b border-border pb-4 mb-6">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full">AI Monthly Audit</span>
                            <span className="text-[10px] text-muted-foreground">{new Date().toLocaleDateString(undefined, {month: 'long', year: 'numeric'})}</span>
                          </div>
                          <h2 className="text-xl font-bold text-foreground mt-2 mb-1">{reportData.groupName}</h2>
                          <p className="text-[10px] text-muted-foreground">Total Group Spend: {reportData.currency} {reportData.totalSpent.toLocaleString()}</p>
                        </div>
                        <ReactMarkdown>{reportData.aiReport}</ReactMarkdown>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </TabsContent>

        {/* TAB: PERSONAL REPORT */}
        <TabsContent value="personal" className="space-y-6 mt-6">
          <Card className="bg-card border-border shadow-xs">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground font-bold">
                <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                Generate Personal Wealth Audit
              </CardTitle>
              <CardDescription>Analyze your overall share of spending and get personalized savings tips across all groups</CardDescription>
            </CardHeader>
            <CardContent className="pb-6 flex flex-wrap gap-3">
              <Button
                onClick={handleGenerateUserReport}
                disabled={generatingUserReport}
                className="bg-foreground text-background hover:bg-foreground/90 font-bold rounded-full py-2.5 px-6 text-xs transition-transform duration-150 active:scale-95 cursor-pointer flex items-center gap-2"
              >
                {generatingUserReport ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing your spending...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    Generate Personal Audit
                  </>
                )}
              </Button>

              <Button
                onClick={handleSendReportEmail}
                disabled={sendingReportEmail}
                variant="outline"
                className="border-border hover:bg-accent text-foreground font-bold rounded-full py-2.5 px-6 text-xs transition-transform duration-150 active:scale-95 cursor-pointer flex items-center gap-2"
              >
                {sendingReportEmail ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending Email...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    Send Report via Email
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {generatingUserReport && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-2xl p-16 text-center space-y-6 shadow-xs"
            >
              <div className="relative flex items-center justify-center mx-auto w-16 h-16">
                <motion.div
                  animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                  className="absolute w-12 h-12 bg-orange-500/20 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.6], opacity: [0.8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut", delay: 0.35 }}
                  className="absolute w-12 h-12 bg-orange-500/30 rounded-full"
                />
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <Brain className="w-8 h-8 text-white animate-pulse" />
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-foreground">SplitMates AI is auditing ledger...</h4>
                <p className="text-[10px] text-muted-foreground max-w-sm mx-auto">Extracting monthly transaction records, analyzing categorizations, and compiling smart saving tips.</p>
              </div>
            </motion.div>
          )}

          {userReportData && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <div className="lg:col-span-1 space-y-6">
                {/* Stats summary */}
                <Card className="bg-card border-border shadow-xs">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-bold text-foreground">Personal Spend Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pb-6">
                    <div className="p-4 bg-muted/50 rounded-2xl">
                      <p className="text-xs text-muted-foreground font-medium">Total Share Owed</p>
                      <p className="text-2xl font-bold text-foreground mt-1">
                        {userReportData.currency} {userReportData.totalSpent.toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
 
                {/* Group spend distribution */}
                {userReportData.groupBreakdown?.length > 0 && (
                  <Card className="bg-card border-border shadow-xs">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-bold text-foreground">Group Spending Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64 flex justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={userReportData.groupBreakdown}
                            dataKey="amount"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={65}
                            fill="#8884d8"
                            labelLine={false}
                          >
                            {userReportData.groupBreakdown.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${userReportData.currency} ${value}`} />
                          <Legend wrapperStyle={{ fontSize: "11px", marginTop: "10px" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}
 
                {/* Category spend distribution */}
                {userReportData.categoryBreakdown?.length > 0 && (
                  <Card className="bg-card border-border shadow-xs">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-bold text-foreground">Category Spending Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64 flex justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={userReportData.categoryBreakdown}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={65}
                            fill="#8884d8"
                            labelLine={false}
                          >
                            {userReportData.categoryBreakdown.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${userReportData.currency} ${value}`} />
                          <Legend wrapperStyle={{ fontSize: "11px", marginTop: "10px" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}
              </div>
 
              {/* Personal Report text */}
              <div className="lg:col-span-2">
                <Card className="bg-card border-border shadow-xs h-full flex flex-col">
                  <CardHeader className="border-b border-border flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-foreground font-bold">
                        <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        Personal Wealth Audit
                      </CardTitle>
                      <CardDescription>Smart savings strategies and multi-group audits</CardDescription>
                    </div>
                    <Button
                      onClick={handleDownloadUserPDF}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1.5 text-xs border-border hover:bg-accent text-foreground font-medium py-1.5 px-3 rounded-full transition-all duration-200 active:scale-95 cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download PDF
                    </Button>
                  </CardHeader>
                  <CardContent className="flex-1 p-6 overflow-hidden flex flex-col min-h-0">
                    <ScrollArea className="flex-1 pr-4">
                      <div ref={userReportRef} data-user-report-container="true" className="prose prose-slate max-w-none text-foreground text-xs leading-relaxed space-y-4">
                        {/* Report Header for PDF */}
                        <div className="border-b border-border pb-4 mb-6">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full">Personal Wealth Audit</span>
                            <span className="text-[10px] text-muted-foreground">{new Date().toLocaleDateString(undefined, {month: 'long', year: 'numeric'})}</span>
                          </div>
                          <h2 className="text-xl font-bold text-foreground mt-2 mb-1">My Spending Share Report</h2>
                          <p className="text-[10px] text-muted-foreground">Total Group Share Owed: {userReportData.currency} {userReportData.totalSpent.toLocaleString()}</p>
                        </div>
                        <ReactMarkdown>{userReportData.aiReport}</ReactMarkdown>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </TabsContent>

        {/* TAB 2: CHAT ASSISTANT */}
        <TabsContent value="chat" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Suggestions pane */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="bg-card border-border shadow-xs">
                <CardHeader>
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                    <Users className="w-4 h-4 text-foreground" />
                    Ask SplitMates Coach
                  </CardTitle>
                  <CardDescription className="text-[10px]">Quick prompts to ask the assistant</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 pb-6">
                  {[
                    "Who owes me money currently?",
                    "How much did I spend this month?",
                    "List my active groups.",
                    "Explain my net balance.",
                    "Give me budgeting tips for my group spendings.",
                  ].map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePresetQuestion(q)}
                      className="text-left text-[11px] bg-muted hover:bg-accent border border-border text-muted-foreground hover:text-foreground p-2.5 rounded-xl transition-all duration-150 cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Chat Pane */}
            <div className="lg:col-span-3">
              <Card className="bg-card border-border shadow-xs h-[600px] flex flex-col overflow-hidden">
                <CardHeader className="border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-foreground flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-background" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold text-foreground">Smart Wealth Coach</CardTitle>
                      <CardDescription className="text-[10px] flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Optimization engine • Context Aware
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-hidden p-6 bg-muted/20">
                  <ScrollArea className="h-full pr-4">
                    <div className="space-y-4">
                      {chatHistory.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex ${
                            msg.role === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[75%] p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap prose prose-sm max-w-none ${
                              msg.role === "user"
                                ? "bg-foreground text-background rounded-br-none shadow-xs"
                                : "bg-card border border-border text-foreground rounded-bl-none shadow-xs"
                            }`}
                          >
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                          </div>
                        </div>
                      ))}
                      {sendingMessage && (
                        <div className="flex justify-start">
                          <div className="bg-card border border-border text-muted-foreground px-4 py-3 rounded-2xl rounded-bl-none shadow-xs flex items-center gap-2 text-xs">
                            <Loader2 className="w-4 h-4 animate-spin text-foreground" />
                            Thinking...
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>

                <CardFooter className="border-t border-border p-4 bg-card">
                  <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Ask about your expenses, e.g. Who has paid the most?"
                      disabled={sendingMessage}
                      className="flex-1 px-4 py-3 bg-muted border border-border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-foreground/15 transition-all duration-150"
                    />
                    <Button
                      type="submit"
                      disabled={!chatMessage.trim() || sendingMessage}
                      size="icon"
                      className="bg-foreground text-background hover:bg-foreground/90 rounded-xl h-11 w-11 shadow-xs shrink-0 transition-transform duration-150 active:scale-95 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;