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
    className: "rounded-none",
    description: "No rounding",
    pixelValue: "0px",
    useCase: "Sharp edges, technical interfaces"
  },
  {
    name: "Small",
    className: "rounded-sm",
    description: "Minimal rounding",
    pixelValue: "2px",
    useCase: "Small buttons, input fields"
  },
  {
    name: "Default",
    className: "rounded",
    description: "Subtle rounding",
    pixelValue: "4px",
    useCase: "Standard buttons, form elements"
  },
  {
    name: "Medium",
    className: "rounded-md",
    description: "Moderate rounding",
    pixelValue: "6px",
    useCase: "Cards, panels, chips"
  },
  {
    name: "Large",
    className: "rounded-lg",
    description: "Base rounding",
    pixelValue: "8px",
    useCase: "Main cards, containers"
  },
  {
    name: "Extra Large",
    className: "rounded-xl",
    description: "Enhanced rounding",
    pixelValue: "12px",
    useCase: "Featured cards, call-to-action"
  },
  {
    name: "2X Large",
    className: "rounded-2xl",
    description: "Prominent rounding",
    pixelValue: "16px",
    useCase: "Hero sections, large cards"
  },
  {
    name: "3X Large",
    className: "rounded-3xl",
    description: "Strong rounding",
    pixelValue: "24px",
    useCase: "Modal dialogs, overlays"
  },
  {
    name: "Full",
    className: "rounded-full",
    description: "Fully rounded",
    pixelValue: "∞",
    useCase: "Avatars, badges, pills"
  }
]

const directionalExamples = [
  { name: "Top Only", className: "rounded-t-lg", description: "Header sections" },
  { name: "Bottom Only", className: "rounded-b-lg", description: "Footer sections" },
  { name: "Left Only", className: "rounded-l-lg", description: "Sidebar panels" },
  { name: "Right Only", className: "rounded-r-lg", description: "Content panels" }
]

export default function CornerRadiusDemo() {
  const [selectedCorner, setSelectedCorner] = useState("rounded-lg")
  const [showDirectional, setShowDirectional] = useState(false)

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Tailwind Rounded Classes Demo</h1>
        <p className="text-muted-foreground">
          Explore Tailwind CSS rounded classes for consistent corner radius styling
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          variant={!showDirectional ? "default" : "outline"}
          onClick={() => setShowDirectional(false)}
          className="rounded-xl"
        >
          All Corners
        </Button>
        <Button
          variant={showDirectional ? "default" : "outline"}
          onClick={() => setShowDirectional(true)}
          className="rounded-xl"
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
                <Badge variant="outline" className="w-fit rounded-lg">
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
      <Card className="rounded-2xl">
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
                This card is using: <code className="rounded-lg bg-muted px-2 py-1 text-sm">{selectedCorner}</code>
              </p>
              <div className="flex gap-2 justify-center flex-wrap">
                <Button className="rounded-lg">Small Button</Button>
                <Button className="rounded-xl">Medium Button</Button>
                <Button className="rounded-2xl">Large Button</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tailwind Rounded Classes */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Tailwind Rounded Classes</CardTitle>
          <p className="text-muted-foreground">
            Standard Tailwind CSS rounded utility classes
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Rounded Classes */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Basic Classes</h4>
              <div className="space-y-3">
                <div className="rounded-none bg-muted p-3">
                  <code>rounded-none</code> - 0px
                </div>
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
              </div>
            </div>

            {/* Extended Classes */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Extended Classes</h4>
              <div className="space-y-3">
                <div className="rounded-xl bg-muted p-3">
                  <code>rounded-xl</code> - 12px
                </div>
                <div className="rounded-2xl bg-muted p-3">
                  <code>rounded-2xl</code> - 16px
                </div>
                <div className="rounded-3xl bg-muted p-3">
                  <code>rounded-3xl</code> - 24px
                </div>
                <div className="rounded-full bg-muted p-3">
                  <code>rounded-full</code> - ∞
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Examples */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
          <p className="text-muted-foreground">
            How to use Tailwind rounded classes in your components
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-xl bg-muted p-4">
              <h4 className="font-semibold mb-2">Component Examples</h4>
              <pre className="text-sm overflow-x-auto">
{`// Button with rounded corners
<Button className="rounded">Click me</Button>

// Card with large rounded corners
<Card className="rounded-lg">Content</Card>

// Avatar with full rounding
<div className="rounded-full">Avatar</div>

// Custom rounded corners
<div className="rounded-t-lg rounded-b-none">
  Header with top corners only
</div>`}
              </pre>
            </div>
            <p className="text-sm text-muted-foreground">
              Use Tailwind's standard rounded classes for consistent corner radius styling across your application.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
