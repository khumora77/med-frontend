import { Col, Input, Row } from "antd";
import React from "react";
import { useUserStore } from "../../store/user-store";
const { Search } = Input;
const UserSearch = () => {
  const {
    filters,
    fetchUsers,
    setFilters,
  } = useUserStore();
  const handleSearch = (value: string) => {
    const newFilters = {
      ...filters,
      search: value || undefined,
      page: 1,
    };
    setFilters(newFilters);
    fetchUsers(newFilters);
  };

  return (
    <div>
      {" "}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Search
            placeholder="Search by email or name..."
            onSearch={handleSearch}
            allowClear
            enterButton
          />
        </Col>
      </Row>
    </div>
  );
};

export default UserSearch;
