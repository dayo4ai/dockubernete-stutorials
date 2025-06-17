"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, AlertTriangle, CheckCircle } from "lucide-react"
import { ApiService } from "@/lib/api-service"

export function ApiStatusIndicator() {
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">("checking")
  const [isRetrying, setIsRetrying] = useState(false)
  const [apiHealthDetails, setApiHealthDetails] = useState<{
    isHealthy: boolean
    status: "online" | "offline"
    error?: any
    responseTime?: number
  } | null>(null)

  const checkApiHealth = async () => {
    setIsRetrying(true)
    try {
      const healthDetails = await ApiService.checkApiHealth()
      setApiHealthDetails(healthDetails)
      setApiStatus(healthDetails.isHealthy ? "online" : "offline")
    } catch (error) {
      setApiStatus("offline")
    } finally {
      setIsRetrying(false)
    }
  }

  useEffect(() => {
    checkApiHealth()
  }, [])

  if (apiStatus === "checking") {
    return (
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
        <Alert className="border-blue-200 bg-blue-50">
          <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
          <AlertDescription className="text-blue-800">Checking API connection...</AlertDescription>
        </Alert>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
      <Alert className={apiStatus === "offline" ? "border-orange-200 bg-orange-50" : "border-green-200 bg-green-50"}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            {apiStatus === "online" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            )}

            <div className="flex-1">
              <AlertDescription className={apiStatus === "online" ? "text-green-800" : "text-orange-800"}>
                {apiStatus === "online" ? (
                  <div className="flex items-center gap-2">
                    <span>
                      <strong>Live API Connected</strong>
                    </span>
                    <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                      {ApiService.getApiUrl()}
                    </Badge>
                    {apiHealthDetails?.responseTime && (
                      <Badge variant="secondary" className="text-xs">
                        {apiHealthDetails.responseTime}ms
                      </Badge>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span>
                        <strong>Demo Mode Active</strong>
                      </span>
                      <Badge variant="outline" className="text-xs bg-orange-100 text-orange-700 border-orange-300">
                        Using Mock Data
                      </Badge>
                    </div>
                    {apiHealthDetails?.error && (
                      <div className="text-xs opacity-75">
                        <strong>Issue:</strong>{" "}
                        {apiHealthDetails.error.type === "CORS" ? "CORS/Network Error" : apiHealthDetails.error.message}
                        <br />
                        <strong>Solution:</strong>{" "}
                        {apiHealthDetails.error.type === "CORS"
                          ? "Start your Flask API server or check CORS configuration"
                          : "Check API server status and network connection"}
                      </div>
                    )}
                  </div>
                )}
              </AlertDescription>
            </div>
          </div>

          {apiStatus === "offline" && (
            <Button variant="outline" size="sm" onClick={checkApiHealth} disabled={isRetrying} className="ml-4">
              {isRetrying ? <RefreshCw className="w-3 h-3 animate-spin" /> : "Retry"}
            </Button>
          )}
        </div>
      </Alert>
    </motion.div>
  )
}
