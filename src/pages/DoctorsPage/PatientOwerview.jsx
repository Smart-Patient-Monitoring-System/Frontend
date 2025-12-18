import React, { useState } from "react";import React, { useState } from 'react';
import { 
  Heart, 
  Bell, 
  Settings, 
  Activity,
  AlertTriangle,
  FileText,
  Search,
  User,
  Clock,
  Thermometer,
  Droplets,
  Eye,
  LogOut,
  Users,
  UserCircle,
  AlertCircle,
  Tablet,
  TrendingUp,
  Wifi
} from "lucide-react";

function DocDashboard() {
  // State hooks
  const [hasNotification, setHasNotification] = useState(true);
  const [activeTab, setActiveTab] = useState('patient-overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Event handler for logout
  const handleLogout = () => {
    console.log('Logging out...');
  };

  // Patient data
  const patients = [
    {
      name: 'Sarah Johnson',
      id: 'P-2024-001',
      age: '34y',
      room: '204-B',
      heartRate: '72 bpm',
      temp: '98.2°F',
      spO2: '98%',
      riskLevel: 'Low',
      status: 'stable'
    },
    {
      name: 'Sarah Johnson',
      id: 'P-2024-001',
      age: '34y',
      room: '204-B',
      heartRate: '145 bpm',
      temp: '98.2°F',
      spO2: '98%',
      riskLevel: 'High',
      status: 'Critical'
    },
    {
      name: 'Sarah Johnson',
      id: 'P-2024-001',
      age: '34y',
      room: '204-B',
      heartRate: '90 bpm',
      temp: '98.2°F',
      spO2: '98%',
      riskLevel: 'Medium',
      status: 'Medium'
    }
  ];

  // Statistics data for the 4 boxes
  const statsData = [
    {
      title: 'Total Patients',
      value: '24',
      icon: <Users className="w-6 h-6" />,
      color: '#ffffffff',
      bgColor: '#1A65FE',
      
    },
    {
      title: 'Critical Alerts',
      value: '2',
      icon: <AlertCircle className="w-6 h-6" />,
      color: '#ffffffff',
      bgColor: '#F41D2A',
      
    },
    {
      title: 'IoT Devices',
      value: '48',
      icon: <Wifi className="w-6 h-6" />,
      color: '#ffffffff',
      bgColor: '#00AD42',
      
    },
    {
      title: 'Avg Health Score',
      value: '87',
      suffix: '%',
      icon: <TrendingUp className="w-6 h-6" />,
      color: '#ffffffff',
      bgColor: '#00AC9B',
      
    }
  ];