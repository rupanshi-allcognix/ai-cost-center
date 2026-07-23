'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTheme } from 'next-themes'
import { Check, Bell, Cloud, Loader2, Unplug } from 'lucide-react'
import { useAppStore } from '@/store'
import { connectAWS, getAWSStatus, disconnectAWS } from '@/services/aws-client'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [webhookUrl, setWebhookUrl] = useState('')
  const [testStatus, setTestStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const { awsConnected, awsAccountId, awsAccountAlias, setAWSConnected } = useAppStore()
  const [accessKey, setAccessKey] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [awsStatus, setAwsStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [awsError, setAwsError] = useState('')
  const [checkingStatus, setCheckingStatus] = useState(true)

  useEffect(() => {
    getAWSStatus()
      .then((status) => {
        setAWSConnected(status.connected, status.account_id ?? null, status.account_alias || null)
      })
      .catch(() => {})
      .finally(() => setCheckingStatus(false))
  }, [setAWSConnected])

  async function handleConnect() {
    if (!accessKey || !secretKey) return
    setAwsStatus('loading')
    setAwsError('')
    try {
      const result = await connectAWS(accessKey, secretKey)
      setAWSConnected(true, result.account.account_id, result.account.account_alias || null)
      setAwsStatus('success')
      setAccessKey('')
      setSecretKey('')
    } catch (err) {
      setAwsStatus('error')
      setAwsError(err instanceof Error ? err.message : 'Connection failed')
    }
  }

  async function handleDisconnect() {
    setAwsStatus('loading')
    try {
      await disconnectAWS()
      setAWSConnected(false, null, null)
      setAwsStatus('idle')
    } catch {
      setAwsStatus('error')
      setAwsError('Disconnect failed')
    }
  }

  async function testSlack() {
    if (!webhookUrl) return
    setTestStatus('sending')
    try {
      const res = await fetch('/api/notifications/slack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhook_url: webhookUrl, message: 'Test from AI Cost Center', severity: 'info' }),
      })
      setTestStatus(res.ok ? 'sent' : 'error')
    } catch {
      setTestStatus('error')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Theme</p>
                <p className="text-xs text-muted-foreground">Toggle dark mode</p>
              </div>
              <div className="flex gap-2">
                {['light', 'dark', 'system'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                      theme === t ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent'
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              <CardTitle>Cloud Providers</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {checkingStatus ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Checking connection status...
              </div>
            ) : awsConnected ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <span className="text-sm font-medium">AWS</span>
                    <p className="text-xs text-muted-foreground">
                      Account: {awsAccountId}
                      {awsAccountAlias ? ` (${awsAccountAlias})` : ''}
                    </p>
                  </div>
                  <Badge variant="success" className="text-xs">Connected</Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDisconnect}
                  disabled={awsStatus === 'loading'}
                  className="text-destructive hover:text-destructive"
                >
                  {awsStatus === 'loading' ? (
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  ) : (
                    <Unplug className="mr-1 h-3 w-3" />
                  )}
                  Disconnect
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm font-medium">AWS</span>
                  <Badge variant="outline" className="text-xs">Not Connected</Badge>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Access Key ID</label>
                  <Input
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    placeholder="AKIA..."
                    type="text"
                    autoComplete="off"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Secret Access Key</label>
                  <Input
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder="Enter your secret access key"
                    type="password"
                    autoComplete="off"
                  />
                </div>
                <Button
                  onClick={handleConnect}
                  disabled={!accessKey || !secretKey || awsStatus === 'loading'}
                  size="sm"
                >
                  {awsStatus === 'loading' ? (
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  ) : (
                    <Check className="mr-1 h-3 w-3" />
                  )}
                  Connect AWS
                </Button>
                {awsStatus === 'error' && (
                  <p className="text-xs text-destructive">{awsError}</p>
                )}
                {awsStatus === 'success' && (
                  <p className="text-xs text-success">AWS account connected successfully.</p>
                )}
              </div>
            )}
            {['Azure', 'GCP'].map((provider) => (
              <div key={provider} className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm font-medium">{provider}</span>
                <Badge variant="outline" className="text-xs">Coming Soon</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <CardTitle>Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Slack Webhook URL</label>
              <div className="flex gap-2">
                <Input
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://hooks.slack.com/services/..."
                  className="flex-1"
                />
                <Button variant="outline" size="sm" onClick={testSlack} disabled={testStatus === 'sending' || !webhookUrl}>
                  {testStatus === 'sending' ? 'Sending...' : testStatus === 'sent' ? <><Check className="mr-1 h-3 w-3" /> Sent</> : 'Test'}
                </Button>
              </div>
              {testStatus === 'sent' && <p className="text-xs text-success">Test notification sent to Slack</p>}
              {testStatus === 'error' && <p className="text-xs text-destructive">Failed to send. Check the webhook URL.</p>}
            </div>
            <div className="space-y-2 pt-2 border-t">
              <p className="text-xs text-muted-foreground">Alert rules (coming soon): Configure which anomaly severities trigger notifications.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
