import { Link, useLocation } from 'react-router-dom';
import { Check, Copy, ArrowRight } from 'lucide-react';

export const Success = () => {
    const location = useLocation();
    const { orderId, total, paymentMethod } = location.state || {}; // Fallback if navigated directly

    if (!orderId) {
        return (
            <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-lg text-center max-w-md w-full">
                    <h1 className="text-2xl font-display text-gray-900 mb-4">No Order Found</h1>
                    <p className="text-gray-500 mb-6">It seems you haven't placed an order yet.</p>
                    <Link to="/" className="inline-block px-6 py-3 bg-[#9B7BB5] text-white rounded-xl font-medium hover:bg-[#8A6AA4] transition-colors">
                        Go to Home
                    </Link>
                </div>
            </div>
        );
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could show a toast here
    };

    return (
        <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center p-4 sm:p-8">
            <div className="bg-white rounded-4xl shadow-xl max-w-lg w-full overflow-hidden border border-[#D4C8E8]/30 relative animate-fade-in-up">
                
                {/* Header Decoration */}
                <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-[#5A8A6E]/10 to-transparent pointer-events-none" />
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#9B7BB5]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="p-8 sm:p-12 text-center relative z-10">
                    <div className="w-20 h-20 bg-[#5A8A6E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-[#5A8A6E]" />
                    </div>

                    <h1 className="font-display text-3xl text-gray-900 mb-2">Order Confirmed!</h1>
                    <p className="text-gray-500 mb-8">Thank you for choosing Lunaria.</p>

                    <div className="bg-[#FAF9F7] rounded-2xl p-6 mb-8 border border-gray-100">
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 border-dashed">
                             <span className="text-gray-500 text-sm">Order ID</span>
                             <div className="flex items-center gap-2">
                                <span className="font-mono font-medium text-gray-900 text-lg">{orderId}</span>
                                <button onClick={() => copyToClipboard(orderId)} className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-400 hover:text-gray-600">
                                    <Copy className="w-4 h-4" />
                                </button>
                             </div>
                        </div>
                        
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-500 text-sm">Amount to Pay</span>
                            <span className="font-bold text-gray-900 text-lg">৳{total}</span>
                        </div>

                         <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Payment Method</span>
                            <span className="font-medium text-[#9B7BB5] capitalize">{paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod}</span>
                        </div>
                    </div>

                    {paymentMethod === 'bkash' && (
                        <div className="bg-pink-50 rounded-2xl p-6 mb-8 border border-pink-100 text-left">
                            <h3 className="font-bold text-[#E2136E] mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#E2136E]" />
                                bKash Payment Steps
                            </h3>
                            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 marker:text-[#E2136E] marker:font-bold">
                                <li>Send <span className="font-bold">৳{total}</span> to <span className="font-mono bg-white px-1 py-0.5 rounded border border-pink-100 select-all">01787853308</span> (Personal)</li>
                                <li>Use Ref: <span className="font-mono bg-white px-1 py-0.5 rounded border border-pink-100 select-all">{orderId}</span></li>
                                <li>We'll confirm your order shortly via phone.</li>
                            </ol>
                        </div>
                    )}

                    {paymentMethod === 'cod' && (
                        <div className="bg-purple-50 rounded-2xl p-6 mb-8 border border-purple-100 text-left">
                           <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#9B7BB5]" />
                                What's Next?
                            </h3>
                            <p className="text-sm text-gray-600">
                                Our team will call you shortly to confirm your order details. You can pay cash when the delivery arrives.
                            </p>
                        </div>
                    )}

                    <Link to="/" className="inline-flex items-center gap-2 text-[#9B7BB5] hover:text-[#8A6AA4] font-medium transition-colors group">
                        Return to Shop <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
};
