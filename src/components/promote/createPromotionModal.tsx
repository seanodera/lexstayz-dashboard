import { Modal, Form, Input, DatePicker, Select, InputNumber, Button, Checkbox } from "antd";
import { useState } from "react";
import { IPromotion } from "@/lib/types";

export default function CreatePromotionModal() {
    const [form] = Form.useForm();
    const [stays, setStays] = useState<string[]>([]); // Manage selected stays

    const onFinish = (values: any) => {
        console.log('Form Values:', values); // Logic to handle form submission goes here
    };

    const handleStaysChange = (checkedValues: any) => {
        setStays(checkedValues); // Update selected stays
    };

    return (
        <Modal
            title="Create Promotion"
            visible={true}
            footer={false} // Remove default footer to use custom buttons
            onCancel={() => console.log("Modal closed")} // Replace with desired close logic
        >
            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item
                    label="Promotion Name"
                    name="name"
                    rules={[{ required: true, message: "Please enter the promotion name" }]}
                >
                    <Input placeholder="Enter promotion name" />
                </Form.Item>

                <Form.Item
                    label="Poster Image URL"
                    name="poster"
                    rules={[{ required: true, message: "Please enter the poster URL" }]}
                >
                    <Input placeholder="Enter poster URL" />
                </Form.Item>

                <Form.Item
                    label="Start Date"
                    name="startDate"
                    rules={[{ required: true, message: "Please select the start date" }]}
                >
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="End Date"
                    name="endDate"
                    rules={[{ required: true, message: "Please select the end date" }]}
                >
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: "Please enter a description" }]}
                >
                    <Input.TextArea placeholder="Enter promotion description" rows={4} />
                </Form.Item>

                <Form.Item
                    label="Currency"
                    name="currency"
                    rules={[{ required: true, message: "Please select a currency" }]}
                >
                    <Select placeholder="Select currency">
                        <Select.Option value="USD">USD</Select.Option>
                        <Select.Option value="EUR">EUR</Select.Option>
                        <Select.Option value="GBP">GBP</Select.Option>
                        <Select.Option value="NGN">NGN</Select.Option>
                        {/* Add more currencies as needed */}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Amount"
                    name="amount"
                    rules={[{ required: true, message: "Please enter the amount" }]}
                >
                    <InputNumber min={0} style={{ width: "100%" }} placeholder="Enter amount" />
                </Form.Item>

                <Form.Item
                    label="Stays"
                    name="stays"
                    valuePropName="checkedValues"
                    rules={[{ required: true, message: "Please select associated stays" }]}
                >
                    <Checkbox.Group onChange={handleStaysChange}>
                        <Checkbox value="stay1">Stay 1</Checkbox>
                        <Checkbox value="stay2">Stay 2</Checkbox>
                        <Checkbox value="stay3">Stay 3</Checkbox>
                        {/* Dynamically populate stays */}
                    </Checkbox.Group>
                </Form.Item>

                <Form.Item
                    label="Status"
                    name="status"
                    rules={[{ required: true, message: "Please select a status" }]}
                >
                    <Select placeholder="Select status">
                        <Select.Option value="active">Active</Select.Option>
                        <Select.Option value="inactive">Inactive</Select.Option>
                        <Select.Option value="archived">Archived</Select.Option>
                    </Select>
                </Form.Item>

                <div style={{ textAlign: "right" }}>
                    <Button onClick={() => form.resetFields()} style={{ marginRight: 8 }}>
                        Reset
                    </Button>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}
