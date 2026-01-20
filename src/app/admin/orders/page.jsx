'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/orders');
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                }
            } catch (error) {
                console.error("Failed to fetch orders");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-[#630D16] text-[#FDFCF0] p-4 shadow-md">
                <h1 className="text-xl font-serif">Staff Dashboard</h1>
            </div>

            <div className="max-w-7xl mx-auto p-4 md:p-8">
                <h2 className="text-2xl text-[#3D2B1F] mb-6 font-serif">Incoming Pre-Orders</h2>

                {loading ? (
                    <div>Loading orders...</div>
                ) : (
                    <div className="grid gap-6">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white p-6 rounded shadow border border-gray-200">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-sm font-bold text-gray-500">#{order.simpleId}</span>
                                        <h3 className="text-lg font-bold text-[#630D16]">{order.user?.name || 'Guest'}</h3>
                                        <p className="text-sm text-gray-600">Branch: {order.branch?.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg">₹{order.totalAmount}</p>
                                        <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                            order.status === 'READY' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <h4 className="text-sm font-medium mb-2">Items:</h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                                        {order.items?.map((item) => (
                                            <li key={item.id} className="flex justify-between">
                                                <span>{item.quantity}x {item.product?.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-4 text-sm text-gray-500 flex justify-between items-center">
                                    <span>Pickup: {new Date(order.pickupTime).toLocaleString()}</span>
                                    <div className="flex gap-2">
                                        <Button className="bg-[#4A6741] text-xs h-8">Mark Ready</Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
