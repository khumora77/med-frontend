import React from 'react';
import {
  Card,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  Row,
  Col,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useAppointmentStore } from '../../store/appointmentStore';

const { Option } = Select;
const { RangePicker } = DatePicker;

export const AppointmentSearch: React.FC = () => {
  const {
    filters,
    setFilters,
    fetchAppointments,
    resetFilters,
  } = useAppointmentStore();

  const handleSearch = (value: string) => {
    const newFilters = { ...filters, search: value, page: 1 };
    setFilters(newFilters);
    fetchAppointments(newFilters);
  };

  const handleStatusChange = (status: string) => {
    const newFilters = { ...filters, status, page: 1 };
    setFilters(newFilters);
    fetchAppointments(newFilters);
  };

  const handleDateRangeChange = (dates: any) => {
    const newFilters = {
      ...filters,
      startDate: dates?.[0]?.format('YYYY-MM-DD'),
      endDate: dates?.[1]?.format('YYYY-MM-DD'),
      page: 1,
    };
    setFilters(newFilters);
    fetchAppointments(newFilters);
  };

  const handleClearFilters = () => {
    resetFilters();
    fetchAppointments({ page: 1, limit: 10 });
  };

  const hasActiveFilters = () => {
    return !!(filters.search || filters.status || filters.startDate);
  };

  return (
    <Card size="small" style={{ marginBottom: 16 }}>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12} md={6}>
          <Input
            placeholder="Search by patient or doctor name..."
            prefix={<SearchOutlined />}
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
          />
        </Col>

        <Col xs={12} sm={6} md={4}>
          <Select
            placeholder="Status"
            style={{ width: '100%' }}
            value={filters.status}
            onChange={handleStatusChange}
            allowClear
          >
            <Option value="scheduled">Scheduled</Option>
            <Option value="completed">Completed</Option>
            <Option value="canceled">Canceled</Option>

          </Select>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <RangePicker
            style={{ width: '100%' }}
            placeholder={['Start Date', 'End Date']}
            onChange={handleDateRangeChange}
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            {hasActiveFilters() && (
              <Button
                icon={<ReloadOutlined />}
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            )}
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default AppointmentSearch;