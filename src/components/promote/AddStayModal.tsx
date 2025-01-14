'use client'
import { Modal, Select, List, Typography, Button } from "antd";
import { useAppSelector } from "@/hooks/hooks";
import { selectAllStays } from "@/slices/staySlice";
import { useState } from "react";
import {Stay} from "@/lib/types";
import ListingItem from "@/components/accomodations/ListingItem";
import {DeleteOutlined} from "@ant-design/icons";

const { Option } = Select;
const { Title, Text } = Typography;

export default function AddStayModal({ show, setShow, stays, setStays }: {show: boolean,setShow: (value:boolean) => void, stays: Stay[], setStays: (value: Stay[]) => void}) {
    const allStays = useAppSelector(selectAllStays); // Get all stays from Redux store
    const [selectedStay, setSelectedStay] = useState<Stay>(); // State for selected stay details

    const handleChange = (stayId: string) => {

        const stayDetails = allStays.find((stay) => stay.id === stayId);
        if (stayDetails){
            setSelectedStay(stayDetails);
        }

    };

    const handleAddStay = () => {
        if (selectedStay) {
            // Check if stay is already in the list
            const isAlreadyAdded = stays.some((stay) => stay.id === selectedStay.id);
            if (!isAlreadyAdded) {
                setStays([...stays, selectedStay]); // Add stay to the list
            }
        }
    };

    return (
        <Modal
            title="Add Stay"
            open={show}
            onCancel={() => setShow(false)}
            onOk={() => setShow(false)}
            onClose={() => setShow(false)}
            footer={[
                <Button key="cancel" onClick={() => setShow(false)}>
                    Cancel
                </Button>,
                <Button key="add" type="primary" onClick={handleAddStay}>
                    Add Stay
                </Button>,
            ]}
        >
            <div className="space-y-4">
                {/* Stay Selector */}
                <Select
                    placeholder="Select a Stay"
                    style={{ width: "100%" }}
                    onChange={handleChange}
                >
                    {allStays.filter((stay) => stay.published === true).map((stay) => (
                        <Option
                            key={stay.id}
                            value={stay.id}
                            disabled={stays.some((s) => s.id === stay.id)} // Disable if already added
                        >
                            {`${stay.id} - ${stay.name} - ${stay.location.district}, ${stay.location.country}`}
                        </Option>
                    ))}
                </Select>

                {/* Stay Details */}
                {selectedStay && (
                   <ListingItem stay={selectedStay}/>
                )}

                {/* List of Added Stays */}
                <List
                    size="small"
                    bordered
                    header={<strong>Added Stays</strong>}
                    dataSource={stays}
                    renderItem={(stay) => (
                        <List.Item>
                            <div className={''}>{`${stay.id} - ${stay.name} - ${stay.location.district}, ${stay.location.country}`}</div>
                            <Button onClick={() => {
                                setStays(stays.filter((value) => value.id !== stay.id));
                            }} type={'primary'} danger size={'small'} icon={<DeleteOutlined/>}/>
                        </List.Item>
                    )}
                />
            </div>
        </Modal>
    );
}
