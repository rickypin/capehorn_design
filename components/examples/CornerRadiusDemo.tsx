"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

/**
 * Corner Radius System Demo Component
 * 
 * This component demonstrates the new corner radius system alongside
 * the legacy system for comparison and testing purposes.
 */

interface CornerExample {
  name: string
  className: string
  description: string
  pixelValue: string
  useCase: string
}

const cornerExamples: CornerExample[] = [
  {
    name: "None",
    className: "corner-none",
    description: "No rounding",
    pixelValue: "0px",
    useCase: "Sharp edges, technical interfaces"
  },
  {
    name: "Extra Small",
    className: "corner-xs",
    description: "Minimal rounding",
    pixelValue: "4px",
    useCase: "Small buttons, input fields"
  },
  {
    name: "Small",
    className: "corner-sm",
    description: "Subtle rounding",
    pixelValue: "8px",
    useCase: "Standard buttons, form elements"
  },
  {
    name: "Medium",
    className: "corner-md",
    description: "Moderate rounding",
    pixelValue: "12px",
    useCase: "Cards, panels, chips"
  },
  {
    name: "Large",
    className: "corner-lg",
    description: "Base rounding (configurable)",
    pixelValue: "16px",
    useCase: "Main cards, containers"
  },
  {
    name: "Large Plus",
    className: "corner-lg-plus",
    description: "Enhanced rounding",
    pixelValue: "20px",
    useCase: "Featured cards, call-to-action"
  },
  {
    name: "Extra Large",
    className: "corner-xl",
    description: "Prominent rounding",
    pixelValue: "28px",
    useCase: "Hero sections, large cards"
  },
  {
    name: "Extra Large Plus",
    className: "corner-xl-plus",
    description: "Strong rounding",
    pixelValue: "32px",
    useCase: "Modal dialogs, overlays"
  },
  {
    name: "Extra Extra Large",
    className: "corner-2xl",
    description: "Maximum rounding",
    pixelValue: "48px",
    useCase: "Hero sections, landing pages"
  },
  {
    name: "Full",
    className: "corner-full",
    description: "Fully rounded",
    pixelValue: "∞",
    useCase: "Avatars, badges, pills"
  }
]

const directionalExamples = [
  { name: "Top Only", className: "corner-t-lg corner-b-none", description: "Header sections" },
  { name: "Bottom Only", className: "corner-b-lg corner-t-none", description: "Footer sections" },
  { name: "Left Only", className: "corner-l-lg corner-r-none", description: "Sidebar panels" },
  { name: "Right Only", className: "corner-r-lg corner-l-none", description: "Content panels" }
]

export default function CornerRadiusDemo() {
  const [selectedCorner, setSelectedCorner] = useState("corner-lg")
  const [showDirectional, setShowDirectional] = useState(false)

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Corner Radius System Demo</h1>
        <p className="text-muted-foreground">
          Explore the new corner radius system with Material Design 3 inspired scaling
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          variant={!showDirectional ? "default" : "outline"}
          onClick={() => setShowDirectional(false)}
          className="corner-md"
        >
          All Corners
        </Button>
        <Button
          variant={showDirectional ? "default" : "outline"}
          onClick={() => setShowDirectional(true)}
          className="corner-md"
        >
          Directional Corners
        </Button>
      </div>

      {/* Main Demo Grid */}
      {!showDirectional ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cornerExamples.map((example) => (
            <Card
              key={example.name}
              className={`${example.className} cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedCorner === example.className ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedCorner(example.className)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{example.name}</CardTitle>
                <Badge variant="outline" className="w-fit corner-sm">
                  {example.pixelValue}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {example.description}
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  .{example.className}
                </p>
                <p className="text-xs text-primary font-medium">
                  {example.useCase}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {directionalExamples.map((example) => (
            <Card
              key={example.name}
              className={`${example.className} cursor-pointer transition-all duration-200 hover:shadow-lg`}
            >
              <CardHeader>
                <CardTitle className="text-lg">{example.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {example.description}
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  .{example.className}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Interactive Preview */}
      <Card className="corner-lg">
        <CardHeader>
          <CardTitle>Interactive Preview</CardTitle>
          <p className="text-muted-foreground">
            Click on any corner example above to see it applied to this card
          </p>
        </CardHeader>
        <CardContent>
          <div className={`${selectedCorner} bg-gradient-to-br from-primary/10 to-secondary/10 p-8 border border-border`}>
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Preview Card</h3>
              <p className="text-muted-foreground">
                This card is using: <code className="corner-sm bg-muted px-2 py-1 text-sm">{selectedCorner}</code>
              </p>
              <div className="flex gap-2 justify-center flex-wrap">
                <Button className="corner-sm">Small Button</Button>
                <Button className="corner-md">Medium Button</Button>
                <Button className="corner-lg">Large Button</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Comparison */}
      <Card className="corner-lg">
        <CardHeader>
          <CardTitle>System Comparison</CardTitle>
          <p className="text-muted-foreground">
            Legacy vs New Corner Radius Systems
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Legacy System */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Legacy System</h4>
              <div className="space-y-3">
                <div className="rounded-sm bg-muted p-3">
                  <code>rounded-sm</code> - 2px
                </div>
                <div className="rounded bg-muted p-3">
                  <code>rounded</code> - 4px
                </div>
                <div className="rounded-md bg-muted p-3">
                  <code>rounded-md</code> - 6px
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <code>rounded-lg</code> - 8px
                </div>
                <div className="rounded-xl bg-muted p-3">
                  <code>rounded-xl</code> - 12px
                </div>
              </div>
            </div>

            {/* New System */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">New Corner System</h4>
              <div className="space-y-3">
                <div className="corner-xs bg-muted p-3">
                  <code>corner-xs</code> - 4px
                </div>
                <div className="corner-sm bg-muted p-3">
                  <code>corner-sm</code> - 8px
                </div>
                <div className="corner-md bg-muted p-3">
                  <code>corner-md</code> - 12px
                </div>
                <div className="corner-lg bg-muted p-3">
                  <code>corner-lg</code> - 16px (base)
                </div>
                <div className="corner-xl bg-muted p-3">
                  <code>corner-xl</code> - 28px
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Example */}
      <Card className="corner-lg">
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <p className="text-muted-foreground">
            Customize the base corner radius value
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="corner-md bg-muted p-4">
              <h4 className="font-semibold mb-2">CSS Variable Configuration</h4>
              <pre className="text-sm overflow-x-auto">
{`:root {
  --corner-base: 1rem; /* 16px - Default */
  /* or */
  --corner-base: 1.25rem; /* 20px - Larger */
  /* or */
  --corner-base: 0.75rem; /* 12px - Smaller */
}`}
              </pre>
            </div>
            <p className="text-sm text-muted-foreground">
              Changing <code>--corner-base</code> automatically scales all related corner sizes while maintaining proportional relationships.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
