import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HeartPulse, Microscope, Stethoscope, Brain, Activity, Thermometer, CheckCircle2 } from "lucide-react"

export default function DevicesPage() {
  const devices = [
    {
      id: 1,
      title: "CardioMonitor Pro",
      category: "Cardiac Monitoring",
      tagline: "Advanced cardiac care at your fingertips",
      description: "The CardioMonitor Pro is our flagship ECG monitoring system featuring 12-lead configuration, real-time analysis, and AI-powered anomaly detection. Perfect for hospitals, clinics, and emergency response units.",
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80",
      icon: HeartPulse,
      specifications: [
        "12-lead ECG configuration",
        "Real-time arrhythmia detection",
        "AI-powered analysis engine",
        "Cloud connectivity & data sync",
        "Battery life: 24+ hours",
        "HIPAA compliant data storage",
      ],
      applications: [
        "Emergency departments",
        "Intensive care units",
        "Cardiology clinics",
        "Ambulatory monitoring",
        "Remote patient monitoring",
      ],
    },
    {
      id: 2,
      title: "DiagnoScan X2",
      category: "Medical Imaging",
      tagline: "See beyond the surface",
      description: "High-resolution diagnostic imaging device utilizing advanced ultrasound technology for early disease detection and precision medicine. Features 4D imaging capabilities and enhanced tissue characterization.",
      image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=1200&q=80",
      icon: Microscope,
      specifications: [
        "4D ultrasound imaging",
        "Resolution: up to 0.1mm",
        "Multiple transducer options",
        "Advanced tissue characterization",
        "DICOM compliant",
        "Portable design (8kg)",
      ],
      applications: [
        "Obstetrics & gynecology",
        "Cardiology imaging",
        "Musculoskeletal assessment",
        "Vascular studies",
        "Point-of-care diagnostics",
      ],
    },
    {
      id: 3,
      title: "VitalTrack Plus",
      category: "Patient Monitoring",
      tagline: "Continuous care, constant vigilance",
      description: "Comprehensive vital signs monitoring system with continuous tracking of heart rate, blood pressure, SpO2, temperature, and respiratory rate. Features smart alerts and predictive analytics.",
      image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=1200&q=80",
      icon: Stethoscope,
      specifications: [
        "Multi-parameter monitoring",
        "Touch-screen interface (15\")",
        "Wireless connectivity",
        "Predictive analytics",
        "Customizable alarm thresholds",
        "EMR integration ready",
      ],
      applications: [
        "General wards",
        "Post-operative care",
        "Step-down units",
        "Long-term care facilities",
        "Home healthcare",
      ],
    },
    {
      id: 4,
      title: "NeuroSignal Pro",
      category: "Neurological Monitoring",
      tagline: "Decoding brain activity with precision",
      description: "Advanced EEG monitoring system for neurological assessment and seizure detection. Features 32-channel recording, video synchronization, and automated spike detection algorithms.",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=80",
      icon: Brain,
      specifications: [
        "32-channel EEG recording",
        "Video-EEG synchronization",
        "Automated spike detection",
        "Frequency analysis tools",
        "Sleep staging algorithms",
        "Portable & wireless options",
      ],
      applications: [
        "Epilepsy monitoring units",
        "Sleep laboratories",
        "Neurology departments",
        "Research facilities",
        "Pediatric neurology",
      ],
    },
    {
      id: 5,
      title: "RespiCare Analyzer",
      category: "Respiratory Monitoring",
      tagline: "Breathe easier with intelligent monitoring",
      description: "Comprehensive respiratory function analyzer with spirometry, capnography, and pulse oximetry. Ideal for pulmonary function testing and ventilator management.",
      image: "https://images.unsplash.com/photo-1583324113626-70df0f4deaab?w=1200&q=80",
      icon: Activity,
      specifications: [
        "Complete spirometry testing",
        "Real-time capnography",
        "Pulse oximetry integration",
        "Flow-volume loops",
        "Bronchodilator response testing",
        "Cloud-based reporting",
      ],
      applications: [
        "Pulmonary function labs",
        "Respiratory therapy departments",
        "Critical care units",
        "Occupational health screening",
        "Sports medicine",
      ],
    },
    {
      id: 6,
      title: "ThermoSense Smart",
      category: "Temperature Monitoring",
      tagline: "Precision temperature control",
      description: "Non-invasive continuous temperature monitoring system with infrared technology. Features multi-site monitoring and predictive fever detection for early intervention.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80",
      icon: Thermometer,
      specifications: [
        "Non-invasive IR technology",
        "Continuous monitoring",
        "Multi-site capability",
        "Predictive algorithms",
        "Wireless data transmission",
        "0.1°C accuracy",
      ],
      applications: [
        "Neonatal intensive care",
        "Infection control",
        "Surgical suites",
        "Emergency departments",
        "Mass screening applications",
      ],
    },
  ]

  const categories = ["All", "Cardiac Monitoring", "Medical Imaging", "Patient Monitoring", "Neurological Monitoring", "Respiratory Monitoring", "Temperature Monitoring"]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <Badge className="mb-2">Medical Device Portfolio</Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Our Device Portfolio
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore our comprehensive range of FDA-approved biomedical devices designed to advance healthcare delivery and improve patient outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* Devices Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="All" className="w-full">
            <TabsList className="w-full justify-start mb-8 flex-wrap h-auto gap-2">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="px-4">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category} value={category} className="space-y-12">
                {devices
                  .filter((device) => category === "All" || device.category === category)
                  .map((device, index) => (
                    <Card key={device.id} className="overflow-hidden">
                      <div className={`grid lg:grid-cols-2 gap-0 ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                        <div className={`relative h-64 lg:h-full ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                          <Image
                            src={device.image}
                            alt={device.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-8 lg:p-12">
                          <div className="flex items-center gap-3 mb-4">
                            <device.icon className="h-8 w-8 text-primary" />
                            <Badge variant="secondary">{device.category}</Badge>
                          </div>
                          <h2 className="text-3xl font-bold mb-2">{device.title}</h2>
                          <p className="text-lg text-primary mb-4">{device.tagline}</p>
                          <p className="text-muted-foreground mb-6">{device.description}</p>

                          <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                              <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                Key Specifications
                              </h3>
                              <ul className="space-y-2 text-sm text-muted-foreground">
                                {device.specifications.map((spec, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>{spec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                Clinical Applications
                              </h3>
                              <ul className="space-y-2 text-sm text-muted-foreground">
                                {device.applications.map((app, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>{app}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button>Request Information</Button>
                            <Button variant="outline">Download Brochure</Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Need a Custom Solution?</h2>
            <p className="text-lg text-muted-foreground">
              Our engineering team can develop customized biomedical devices tailored to your specific clinical requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">Contact Engineering Team</Button>
              <Button size="lg" variant="outline">Schedule Demo</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
