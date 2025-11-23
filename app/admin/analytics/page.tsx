'use client';

import { useState, useEffect } from "react";
import { Logo } from "@/components/ui/Logo";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { 
  TrendingUp, 
  Users, 
  Phone, 
  Calendar, 
  ExternalLink,
  MapPin,
  Star,
  DollarSign,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Clock,
  Filter
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface AnalyticsData {
  totalClicks: number;
  totalRevenue: number;
  topBarbers: any[];
  recentActivity: any[];
  clicksByType: any;
  dailyStats: any[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Calculate date range
      const days = timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Get ALL click events in range
      const { data: allClicks } = await supabase
        .from('click_events')
        .select(`
          id,
          event_type,
          created_at,
          destination_url,
          barbershop_id,
          barbershops(name, neighborhood)
        `)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (!allClicks) {
        setData({
          totalClicks: 0,
          totalRevenue: 0,
          topBarbers: [],
          recentActivity: [],
          clicksByType: {},
          dailyStats: []
        });
        return;
      }

      // Count clicks by type
      const clicksByType = allClicks.reduce((acc: any, event: any) => {
        acc[event.event_type] = (acc[event.event_type] || 0) + 1;
        return acc;
      }, {});

      // Calculate revenue (using our pricing model)
      const revenueMap: Record<string, number> = {
        phone_call: 3.00,
        booking_click: 2.00,
        website_booking_click: 2.00,
        directions_click: 0.75,
        website_click: 0.50,
        google_reviews_click: 0.25
      };

      const totalRevenue = allClicks.reduce((sum, event) => {
        return sum + (revenueMap[event.event_type] || 0);
      }, 0);

      // Group by barber and count clicks
      const barberStats = allClicks.reduce((acc: any, event: any) => {
        if (!event.barbershops) return acc;
        
        const barberId = event.barbershop_id;
        if (!acc[barberId]) {
          acc[barberId] = {
            id: barberId,
            name: event.barbershops.name,
            neighborhood: event.barbershops.neighborhood,
            totalClicks: 0,
            revenue: 0
          };
        }
        
        acc[barberId].totalClicks++;
        acc[barberId].revenue += (revenueMap[event.event_type] || 0);
        
        return acc;
      }, {});

      const topBarbers = Object.values(barberStats)
        .sort((a: any, b: any) => b.totalClicks - a.totalClicks)
        .slice(0, 10);

      setData({
        totalClicks: allClicks.length,
        totalRevenue,
        topBarbers,
        recentActivity: allClicks.slice(0, 50),
        clicksByType,
        dailyStats: []
      });

    } catch (error) {
      console.error('Analytics error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-la-orange animate-spin rounded mb-4 mx-auto"></div>
          <p className="font-bold text-lg">LOADING ANALYTICS...</p>
        </div>
      </div>
    );
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'phone_call': return <Phone className="w-4 h-4" />;
      case 'booking_click': 
      case 'website_booking_click': return <Calendar className="w-4 h-4" />;
      case 'website_click': return <ExternalLink className="w-4 h-4" />;
      case 'directions_click': return <MapPin className="w-4 h-4" />;
      case 'google_reviews_click': return <Star className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'phone_call': return 'bg-green-100 text-green-800';
      case 'booking_click': 
      case 'website_booking_click': return 'bg-blue-100 text-blue-800';
      case 'website_click': return 'bg-purple-100 text-purple-800';
      case 'directions_click': return 'bg-orange-100 text-orange-800';
      case 'google_reviews_click': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-black">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo size="sm" />
              <h1 className="text-2xl font-bold uppercase tracking-wider">
                LA ANALYTICS
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border-2 border-black bg-white font-bold uppercase text-sm"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
              
              <Link href="/" className="text-sm font-bold hover:text-la-orange">
                ← Back to Site
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-2 border-black">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-8 h-8 text-la-orange" />
              <div>
                <p className="text-sm font-bold text-gray-600">TOTAL CLICKS</p>
                <p className="text-3xl font-bold">{data?.totalClicks.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-2 border-black">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm font-bold text-gray-600">REVENUE VALUE</p>
                <p className="text-3xl font-bold">${data?.totalRevenue.toFixed(0)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-2 border-black">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm font-bold text-gray-600">ACTIVE BARBERS</p>
                <p className="text-3xl font-bold">{data?.topBarbers.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-2 border-black">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm font-bold text-gray-600">AVG PER BARBER</p>
                <p className="text-3xl font-bold">
                  ${data?.topBarbers && data.topBarbers.length > 0 ? (data.totalRevenue / data.topBarbers.length).toFixed(0) : '0'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Click Types Breakdown */}
          <Card className="p-6 border-2 border-black">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              CLICK BREAKDOWN
            </h2>
            <div className="space-y-3">
              {Object.entries(data?.clicksByType || {}).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded ${getEventColor(type)}`}>
                      {getEventIcon(type)}
                    </div>
                    <span className="font-bold uppercase text-sm">
                      {type.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="font-bold text-lg">{count as number}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Performing Barbers */}
          <Card className="p-6 border-2 border-black">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              TOP PERFORMERS
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {data?.topBarbers.slice(0, 10).map((barber, index) => (
                <div key={barber.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-la-orange text-white rounded font-bold flex items-center justify-center text-sm">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{barber.name}</p>
                      <p className="text-xs text-gray-600">{barber.neighborhood}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{barber.totalClicks} clicks</p>
                    <p className="text-sm text-green-600">${barber.revenue.toFixed(0)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8 p-6 border-2 border-black">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6" />
            LIVE ACTIVITY
          </h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {data?.recentActivity.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 text-sm">
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded ${getEventColor(event.event_type)}`}>
                    {getEventIcon(event.event_type)}
                  </div>
                  <div>
                    <span className="font-bold">{event.barbershops?.name}</span>
                    <span className="text-gray-600 ml-2">•</span>
                    <span className="ml-2 text-gray-600">{event.barbershops?.neighborhood}</span>
                  </div>
                </div>
                <div className="text-right text-gray-600">
                  {new Date(event.created_at).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
