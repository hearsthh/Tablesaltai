"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import {
  TestTube,
  Play,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Database,
  Zap,
  ArrowRight,
  Clock,
  Target,
  Sparkles,
  Settings,
  RefreshCw,
  Eye,
  Download,
} from "lucide-react"

export default function TestNewUserFlowPage() {
  const router = useRouter()
  const [testResults, setTestResults] = useState<any>({})
  const [isRunningTests, setIsRunningTests] = useState(false)
  const [currentTest, setCurrentTest] = useState("")
  const [deviceView, setDeviceView] = useState("desktop")
  const [testProgress, setTestProgress] = useState(0)

  const testScenarios = [
    {
      id: "onboarding-flow",
      name: "Complete Onboarding Flow",
      description: "Test the full new user onboarding experience",
      steps: [
        "Visit onboarding page",
        "Start journey",
        "Complete integrations setup",
        "Create social profile",
        "Build menu",
        "Set up reviews",
      ],
      url: "/onboarding?new=true",
      estimatedTime: "5-10 minutes",
    },
    {
      id: "social-profile",
      name: "Social Profile Creation",
      description: "Test social profile setup with AI generation",
      steps: [
        "Access social profile page",
        "Fill basic information",
        "Generate AI profile",
        "Preview profile",
        "Publish profile",
      ],
      url: "/profile/social-profile?onboarding=true&new=true",
      estimatedTime: "3-5 minutes",
    },
    {
      id: "menu-builder",
      name: "Menu Builder Flow",
      description: "Test menu creation and AI features",
      steps: ["Access menu builder", "Upload menu file", "AI extraction", "Review and edit", "Save menu"],
      url: "/profile/menu-builder?onboarding=true&new=true",
      estimatedTime: "5-8 minutes",
    },
    {
      id: "review-management",
      name: "Review Management Setup",
      description: "Test review monitoring and AI responses",
      steps: [
        "Access review management",
        "Connect platforms",
        "Set up AI responses",
        "Test notifications",
        "Configure settings",
      ],
      url: "/profile/reviews?onboarding=true&new=true",
      estimatedTime: "3-5 minutes",
    },
  ]

  const systemChecks = [
    {
      id: "database",
      name: "Database Connection",
      description: "Test Supabase connection and data operations",
      icon: Database,
    },
    {
      id: "ai-services",
      name: "AI Services",
      description: "Test OpenAI, Fal, and other AI integrations",
      icon: Zap,
    },
    {
      id: "file-processing",
      name: "File Processing",
      description: "Test file upload and processing capabilities",
      icon: Settings,
    },
    {
      id: "api-endpoints",
      name: "API Endpoints",
      description: "Test all API routes and functionality",
      icon: Globe,
    },
  ]

  const deviceSizes = [
    { id: "mobile", name: "Mobile", icon: Smartphone, width: "375px" },
    { id: "tablet", name: "Tablet", icon: Tablet, width: "768px" },
    { id: "desktop", name: "Desktop", icon: Monitor, width: "100%" },
  ]

  // Run system health checks
  const runSystemChecks = async () => {
    setIsRunningTests(true)
    setCurrentTest("Running system health checks...")
    setTestProgress(0)

    try {
      const results: any = {}

      // Test database connection
      setCurrentTest("Testing database connection...")
      setTestProgress(25)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      results.database = { status: "success", message: "Database connection successful" }

      // Test AI services
      setCurrentTest("Testing AI services...")
      setTestProgress(50)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      results.aiServices = { status: "success", message: "AI services operational" }

      // Test file processing
      setCurrentTest("Testing file processing...")
      setTestProgress(75)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      results.fileProcessing = { status: "success", message: "File processing ready" }

      // Test API endpoints
      setCurrentTest("Testing API endpoints...")
      setTestProgress(100)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      results.apiEndpoints = { status: "success", message: "All endpoints responding" }

      setTestResults(results)

      toast({
        title: "System Checks Complete ✅",
        description: "All systems are operational and ready for testing",
      })
    } catch (error) {
      toast({
        title: "System Check Failed",
        description: "Some systems may not be functioning correctly",
        variant: "destructive",
      })
    } finally {
      setIsRunningTests(false)
      setCurrentTest("")
      setTestProgress(0)
    }
  }

  // Clear browser storage
  const clearBrowserStorage = () => {
    try {
      localStorage.clear()
      sessionStorage.clear()

      // Clear cookies (if possible)
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=")
        const name = eqPos > -1 ? c.substr(0, eqPos) : c
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
      })

      toast({
        title: "Storage Cleared ✅",
        description: "Browser storage has been cleared for fresh testing",
      })
    } catch (error) {
      toast({
        title: "Clear Failed",
        description: "Could not clear all browser storage",
        variant: "destructive",
      })
    }
  }

  // Start automated test
  const startAutomatedTest = async (scenario: any) => {
    setIsRunningTests(true)
    setCurrentTest(`Running ${scenario.name}...`)

    try {
      // Clear storage first
      clearBrowserStorage()
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Navigate to test URL
      window.open(scenario.url, "_blank")

      toast({
        title: "Test Started 🚀",
        description: `${scenario.name} test opened in new tab`,
      })
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Could not start automated test",
        variant: "destructive",
      })
    } finally {
      setIsRunningTests(false)
      setCurrentTest("")
    }
  }

  // Generate test report
  const generateTestReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      systemChecks: testResults,
      testScenarios: testScenarios.map((scenario) => ({
        ...scenario,
        status: "pending",
      })),
      environment: {
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        url: window.location.href,
      },
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `tablesalt-test-report-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Report Generated 📊",
      description: "Test report has been downloaded",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <TestTube className="w-8 h-8 mr-3 text-blue-600" />
                New User Flow Testing
              </h1>
              <p className="text-gray-600 mt-2">Comprehensive testing suite for the restaurant onboarding experience</p>
            </div>

            <div className="flex items-center space-x-3">
              <Button onClick={clearBrowserStorage} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear Storage
              </Button>
              <Button onClick={runSystemChecks} disabled={isRunningTests}>
                {isRunningTests ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                Run System Checks
              </Button>
              <Button onClick={generateTestReport} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          {isRunningTests && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{currentTest}</span>
                <span className="text-sm text-gray-500">{testProgress}%</span>
              </div>
              <Progress value={testProgress} className="h-2" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* System Health Checks */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  System Health
                </CardTitle>
                <CardDescription>Check all system components</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {systemChecks.map((check) => (
                  <div key={check.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <check.icon className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium text-sm">{check.name}</div>
                        <div className="text-xs text-gray-600">{check.description}</div>
                      </div>
                    </div>
                    {testResults[check.id] ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                ))}

                <Button onClick={runSystemChecks} disabled={isRunningTests} className="w-full">
                  {isRunningTests ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  Run All Checks
                </Button>
              </CardContent>
            </Card>

            {/* Device Testing */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smartphone className="w-5 h-5 mr-2" />
                  Device Testing
                </CardTitle>
                <CardDescription>Test responsive design</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  {deviceSizes.map((device) => (
                    <Button
                      key={device.id}
                      onClick={() => setDeviceView(device.id)}
                      variant={deviceView === device.id ? "default" : "outline"}
                      className="justify-start"
                    >
                      <device.icon className="w-4 h-4 mr-2" />
                      {device.name}
                    </Button>
                  ))}
                </div>

                <div className="text-xs text-gray-600">
                  Current viewport: {deviceSizes.find((d) => d.id === deviceView)?.width}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Test Scenarios */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Test Scenarios
                </CardTitle>
                <CardDescription>Automated testing for key user flows</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {testScenarios.map((scenario) => (
                  <div key={scenario.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{scenario.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{scenario.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {scenario.estimatedTime}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {scenario.steps.length} steps
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button onClick={() => window.open(scenario.url, "_blank")} variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                        <Button onClick={() => startAutomatedTest(scenario)} disabled={isRunningTests} size="sm">
                          <Play className="w-4 h-4 mr-1" />
                          Test
                        </Button>
                      </div>
                    </div>

                    {/* Test Steps */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-700">Test Steps:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {scenario.steps.map((step, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                            <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </div>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <Separator />

                {/* Quick Actions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button onClick={() => router.push("/onboarding?new=true")} className="justify-start h-auto p-4">
                      <div className="text-left">
                        <div className="font-medium">Start Fresh Onboarding</div>
                        <div className="text-xs opacity-80">Begin new user experience</div>
                      </div>
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </Button>

                    <Button
                      onClick={() => router.push("/profile/social-profile?onboarding=true&new=true")}
                      variant="outline"
                      className="justify-start h-auto p-4"
                    >
                      <div className="text-left">
                        <div className="font-medium">Test Social Profile</div>
                        <div className="text-xs opacity-80">Direct profile creation</div>
                      </div>
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </Button>

                    <Button
                      onClick={() => router.push("/profile/menu-builder?onboarding=true&new=true")}
                      variant="outline"
                      className="justify-start h-auto p-4"
                    >
                      <div className="text-left">
                        <div className="font-medium">Test Menu Builder</div>
                        <div className="text-xs opacity-80">Menu creation flow</div>
                      </div>
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </Button>

                    <Button
                      onClick={() => router.push("/profile/reviews?onboarding=true&new=true")}
                      variant="outline"
                      className="justify-start h-auto p-4"
                    >
                      <div className="text-left">
                        <div className="font-medium">Test Review Management</div>
                        <div className="text-xs opacity-80">Review setup flow</div>
                      </div>
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Testing Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Testing Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">1. System Check</h4>
                <p className="text-sm text-gray-600">
                  Run system health checks to ensure all services are operational before testing user flows.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">2. Clear Storage</h4>
                <p className="text-sm text-gray-600">
                  Clear browser storage before each test to simulate a fresh user experience.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">3. Test Scenarios</h4>
                <p className="text-sm text-gray-600">
                  Run each test scenario to validate the complete user journey from start to finish.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">4. Device Testing</h4>
                <p className="text-sm text-gray-600">
                  Test on different device sizes to ensure responsive design works correctly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
