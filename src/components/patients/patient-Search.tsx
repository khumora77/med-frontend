import { Col, Input, Row, Select } from "antd";
import { usePatientStore } from "../../store/patientStore";
const { Option } = Select;
const { Search } = Input;

const PatientSearch = () => {
  const {
    filters,
    fetchPatients,
    setFilters,
  } = usePatientStore();
  const handleSearch = (value: string) => {
    const newFilters = {
      ...filters,
      search: value || undefined,
      page: 1,
    };
    setFilters(newFilters);
    fetchPatients(newFilters);
  };

  const handleGenderFilter = (value: string) => {
    const newFilters = {
      ...filters,
      gender: value || undefined,
      page: 1,
    };
    setFilters(newFilters);
    fetchPatients(newFilters);
  };
  return (
    <div>
      {" "}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Search
            placeholder="Search by name, surname or email..."
            onSearch={handleSearch}
            allowClear
            enterButton
          />
        </Col>
        <Col xs={12} sm={6} md={5} lg={4}>
          <Select
            placeholder="Gender"
            style={{ width: "100%" }}
            onChange={handleGenderFilter}
            value={filters.gender}
            allowClear
          >
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="child">Child</Option>
          </Select>
        </Col>
      </Row>
    </div>
  );
};

export default PatientSearch;
