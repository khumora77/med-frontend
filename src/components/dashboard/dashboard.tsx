// src/components/dashboard/Dashboard.tsx
import React, { useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Spin, Alert } from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  RiseOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { useDashboardStore } from '../../store/dashboard-store';
import { UserRoleChart } from './userRoleChart';
import { UserGrowthChart } from './UserGrowthChart';

export const Dashboard: React.FC = () => {
  const { stats, loading, error, fetchStats, clearError } = useDashboardStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading && !stats) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Dashboard yuklanmoqda...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Xatolik"
        description={error}
        type="error"
        showIcon
        closable
        onClose={clearError}
      />
    );
  }

  if (!stats) return null;

  const recentUsersColumns = [
    {
      title: 'Foydalanuvchi',
      dataIndex: 'email',
      key: 'email',
      render: (email: string, record: any) => (
        <div>
          <div>{email}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.firstName} {record.lastName}
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={getRoleColor(role)}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Qoʻshilgan sana',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('uz-UZ'),
    },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'red';
      case 'doctor': return 'blue';
      case 'reception': return 'green';
      case 'user': return 'gray';
      default: return 'default';
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      
      {/* Statistik kartalar */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Jami Foydalanuvchilar"
              value={stats.totalUsers}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Faol Foydalanuvchilar"
              value={stats.usersByStatus.find(s => s.status === 'active')?.count || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Adminlar"
              value={stats.usersByRole.find(r => r.role === 'admin')?.count || 0}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Doktorlar"
              value={stats.usersByRole.find(r => r.role === 'doctor')?.count || 0}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Chartlar */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Foydalanuvchilar Role Boʻyicha" bordered={false}>
            <UserRoleChart data={stats.usersByRole} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Oylik Foydalanuvchi Oʻsishi" bordered={false}>
            <UserGrowthChart data={stats.monthlyGrowth} />
          </Card>
        </Col>
      </Row>

      {/* Soʻngi foydalanuvchilar */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="Soʻngi Qoʻshilgan Foydalanuvchilar" bordered={false}>
            <Table
              dataSource={stats.recentUsers}
              columns={recentUsersColumns}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};