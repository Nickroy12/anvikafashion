"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ArrowRight, Home, Receipt, Calendar, Printer, Loader2, FileText } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import dynamic from "next/dynamic";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Dynamically import PDFViewer to avoid SSR issues
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false }
);

// PDF Styles
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", color: "#333" },
  headerContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30, borderBottomWidth: 2, borderBottomColor: "#10b981", paddingBottom: 15 },
  brandName: { fontSize: 28, fontWeight: "bold", color: "#10b981" },
  brandTagline: { fontSize: 10, color: "#666", marginTop: 4 },
  invoiceTitle: { fontSize: 24, fontWeight: "bold", color: "#333", textAlign: "right" },
  section: { marginBottom: 20 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  label: { fontSize: 11, color: "#6b7280" },
  value: { fontSize: 11, fontWeight: "bold", color: "#111827" },
  tableHeader: { flexDirection: "row", backgroundColor: "#f9fafb", padding: 10, borderBottomWidth: 1, borderBottomColor: "#e5e7eb", borderRadius: 4 },
  col1: { width: "50%", fontSize: 11, fontWeight: "bold", color: "#374151" },
  col2: { width: "25%", fontSize: 11, fontWeight: "bold", color: "#374151", textAlign: "center" },
  col3: { width: "25%", fontSize: 11, fontWeight: "bold", color: "#374151", textAlign: "right" },
  tableRow: { flexDirection: "row", padding: 10, borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  cell1: { width: "50%", fontSize: 11, color: "#4b5563" },
  cell2: { width: "25%", fontSize: 11, color: "#4b5563", textAlign: "center" },
  cell3: { width: "25%", fontSize: 11, color: "#4b5563", textAlign: "right" },
  totalContainer: { marginTop: 20, paddingTop: 15, borderTopWidth: 2, borderTopColor: "#10b981", flexDirection: "row", justifyContent: "flex-end" },
  totalLabel: { fontSize: 14, fontWeight: "bold", marginRight: 20, color: "#374151" },
  totalValue: { fontSize: 16, fontWeight: "bold", color: "#10b981" },
  footer: { position: "absolute", bottom: 40, left: 40, right: 40, textAlign: "center", borderTopWidth: 1, borderTopColor: "#e5e7eb", paddingTop: 10 },
  footerText: { fontSize: 9, color: "#9ca3af", marginBottom: 3 }
});

// PDF Document Component
const InvoicePDF = ({ order }: { order: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.brandName}>Anvika Fashion</Text>
          <Text style={styles.brandTagline}>Your style, your signature.</Text>
        </View>
        <View>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
        </View>
      </View>

      {/* Transaction Details */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Transaction ID:</Text>
          <Text style={styles.value}>{order.transactionId}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>Paid</Text>
        </View>
      </View>

      {/* Items Table */}
      <View style={[styles.section, { marginTop: 10 }]}>
        <View style={styles.tableHeader}>
          <Text style={styles.col1}>Item Description</Text>
          <Text style={styles.col2}>Quantity</Text>
          <Text style={styles.col3}>Price</Text>
        </View>

        {order.items && order.items.length > 0 ? (
          order.items.map((item: any, idx: number) => (
            <View key={item.id || idx} style={styles.tableRow}>
              <Text style={styles.cell1}>{item.name || item.title}</Text>
              <Text style={styles.cell2}>{item.quantity || 1}</Text>
              <Text style={styles.cell3}>${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</Text>
            </View>
          ))
        ) : (
          <View style={styles.tableRow}>
            <Text style={styles.cell1}>No item details available.</Text>
          </View>
        )}

        {/* Total */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Paid:</Text>
          <Text style={styles.totalValue}>${Number(order.price || order.total || 0).toFixed(2)}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Thank you for shopping with Anvika Fashion!</Text>
        <Text style={styles.footerText}>Contact us at support@anvikafashion.com</Text>
      </View>
    </Page>
  </Document>
);

export default function PaymentSuccessPage({
  params,
}: {
  params: Promise<{ tranId: string }>;
}) {
  const { tranId } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"summary" | "pdf">("summary");
  const { clearCart } = useCartStore();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/orders`);
        if (!res.ok) throw new Error("Failed to fetch orders");
        const orders = await res.json();
        const foundOrder = orders.find((o: any) => o.transactionId === tranId);
        if (foundOrder) {
          setOrder(foundOrder);
          clearCart(); // Clear the cart when payment is confirmed successful
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [tranId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
        <h2 className="text-xl font-bold">Order Not Found</h2>
        <Link href="/" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 print:p-0 print:bg-white print:text-black print:block print:min-h-0 print:h-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full bg-card text-card-foreground border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden print:shadow-none print:border-none print:p-0 print:rounded-none print:max-w-none print:overflow-visible transition-all duration-300 ${activeTab === "pdf" ? "max-w-5xl" : "max-w-2xl"
          }`}
      >
        {/* Glow effect - hide on print */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-green-500/10 blur-3xl rounded-t-3xl pointer-events-none print:hidden" />

        <div className="flex flex-col items-center text-center relative z-10">

          <div className="flex justify-between items-center w-full mb-8 print:hidden">
            <div className="flex bg-muted/50 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab("summary")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === "summary"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
              >
                Order Summary
              </button>
              <button
                onClick={() => setActiveTab("pdf")}
                className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-all ${activeTab === "pdf"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
              >
                <FileText className="w-4 h-4" />
                Invoice PDF
              </button>
            </div>

          </div>

          <AnimatePresence mode="wait">
            {activeTab === "summary" ? (
              <motion.div
                key="summary"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="w-full flex flex-col items-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 print:hidden"
                >
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold mb-2 tracking-tight print:text-black"
                >
                  Payment Successful!
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-muted-foreground mb-8 print:text-gray-600"
                >
                  Your order has been processed and is now complete.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="w-full bg-muted/30 rounded-2xl p-6 border border-border/50 mb-8 text-left print:bg-white print:border-gray-200 print:text-black print:border"
                >
                  {/* Transaction Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-1">
                      <span className="text-muted-foreground flex items-center gap-2 text-sm print:text-gray-500">
                        <Receipt className="w-4 h-4" />
                        Transaction ID
                      </span>
                      <p className="font-mono text-sm font-medium">{tranId}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground flex items-center gap-2 text-sm print:text-gray-500">
                        <Calendar className="w-4 h-4" />
                        Date
                      </span>
                      <p className="text-sm font-medium">
                        {new Date().toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-border/50 pt-6 print:border-gray-200">
                    <h3 className="font-semibold mb-4 text-lg">Order Summary</h3>

                    <div className="space-y-3 mb-6">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item: any, idx: number) => (
                          <div key={item.id || idx} className="flex justify-between text-sm">
                            <div>
                              <span className="font-medium">{item.name || item.title}</span>
                              <span className="text-muted-foreground ml-2 print:text-gray-500">x{item.quantity || 1}</span>
                            </div>
                            <span>${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground">No item details available.</div>
                      )}
                    </div>

                    <div className="border-t border-border/50 pt-4 space-y-2 text-sm print:border-gray-200">
                      <div className="flex justify-between font-bold text-base mt-2 pt-2 border-border/50 print:border-gray-200 print:text-black">
                        <span>Total Paid</span>
                        <span>${Number(order.price || order.total || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Actions - hidden when printing */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-3 w-full print:hidden"
                >
                  <Link
                    href="/"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors font-medium text-sm"
                  >
                    <Home className="w-4 h-4" />
                    Home
                  </Link>
                  <Link
                    href="/dashboard"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-colors font-medium text-sm shadow-sm"
                  >
                    Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="pdf"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="w-full flex flex-col h-[70vh] rounded-xl overflow-hidden border border-border bg-white"
              >
                <PDFViewer width="100%" height="100%" className="rounded-xl border-none">
                  <InvoicePDF order={order} />
                </PDFViewer>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

