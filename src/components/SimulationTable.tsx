import type { SimulationData } from "../utils/fetchData";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, TextField, Button,
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { saveAs } from "file-saver";
import React, { useState, useMemo } from "react";

interface Props {
    data: SimulationData[];
}

const SimulationTable: React.FC<Props> = ({ data }) => {
    const [search, setSearch] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: keyof SimulationData; direction: "asc" | "desc" } | null>(null);

    const filteredData = useMemo(() => {
        if (!search) return data;
        try {
            const regex = new RegExp(search);
            return data.filter(item =>
                Object.values(item).some(val =>
                    regex.test(String(val ?? ""))
                )
            );
        } catch (e) {
            return data;
        }
    }, [data, search]);

    // data sorting
    const sortedData = useMemo(() => {
        if (!sortConfig) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue == null && bValue == null) return 0;
            if (aValue == null) return sortConfig.direction === "asc" ? -1 : 1;
            if (bValue == null) return sortConfig.direction === "asc" ? 1 : -1;

            if (sortConfig.key === "value" || sortConfig.key === "performance_index") {
                const aNum = typeof aValue === "number" ? aValue : Number.NEGATIVE_INFINITY;
                const bNum = typeof bValue === "number" ? bValue : Number.NEGATIVE_INFINITY;
                return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
            }

            if (sortConfig.key === "timestamp") {
                const dateA = new Date(String(aValue)).getTime();
                const dateB = new Date(String(bValue)).getTime();
                return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
            }

            const aStr = String(aValue).toLowerCase();
            const bStr = String(bValue).toLowerCase();

            if (aStr < bStr) return sortConfig.direction === "asc" ? -1 : 1;
            if (aStr > bStr) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortConfig]);


    const exportToCSV = () => {
        const header = ["ID", "Timestamp", "Value", "Parameter Set", "Status", "Performance Index"];
        const rows = sortedData.map(item => [
            item.id,
            new Date(item.timestamp).toLocaleString(),
            typeof item.value === "number" ? item.value : "N/A",
            item.parameter_set,
            item.status,
            (item.performance_index ?? 0).toFixed(2),
        ]);
        const csvContent = [header, ...rows].map(row => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "simulation_data.csv");
    };

    return (
        <Paper sx={{ padding: 2 }}>
            <TextField
                label="Search"
                variant="outlined"
                fullWidth
                margin="normal"
                value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                            borderColor: "#8884d8",
                        },
                        "&:hover fieldset": {
                            borderColor: "#6c6cc4",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#8884d8",
                        },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                        color: "#8884d8",
                    },
                }}
            />
            <TableContainer component={Paper} sx={{ maxHeight: 400, overflowY: 'auto' }}>
                <Table stickyHeader size="small" aria-label="simulation table">
                    <TableHead>
                        <TableRow>
                            {["id", "timestamp", "value", "parameter_set", "status", "performance_index"].map((col) => {
                                const isActive = sortConfig?.key === col;
                                return (
                                    <TableCell
                                        key={col}
                                        onClick={() => {
                                            const isAsc = sortConfig?.key === col && sortConfig.direction === "asc";
                                            setSortConfig({ key: col as keyof SimulationData, direction: isAsc ? "desc" : "asc" });
                                        }}
                                        sx={{
                                            cursor: "pointer",
                                            userSelect: "none",
                                            fontWeight: "bold",
                                            color: "rgba(0, 0, 0, 0.87)",
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                            {col.replace("_", " ").toUpperCase()}
                                            <span style={{ color: "#8884d8", marginLeft: 6, display: "flex", alignItems: "center" }}>
                                                <ArrowUpward
                                                    fontSize="small"
                                                    sx={{
                                                        opacity: sortConfig?.key === col && sortConfig.direction === "asc" ? 1 : 0.3,
                                                    }}
                                                />
                                                <ArrowDownward
                                                    fontSize="small"
                                                    sx={{
                                                        marginLeft: 0.3,
                                                        opacity: sortConfig?.key === col && sortConfig.direction === "desc" ? 1 : 0.3,
                                                    }}
                                                />
                                            </span>
                                        </div>
                                    </TableCell>

                                );
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>


                        {sortedData.map(item => (
                            <TableRow
                                key={item.id}
                                sx={{
                                    cursor: "pointer",
                                    "&:hover": {
                                        backgroundColor: "#fff8e1",
                                    },
                                }}
                            >
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{new Date(item.timestamp).toLocaleString()}</TableCell>
                                <TableCell>{typeof item.value === "number" ? item.value : "N/A"}</TableCell>
                                <TableCell>{item.parameter_set}</TableCell>
                                <TableCell>{item.status}</TableCell>
                                <TableCell>{(item.performance_index ?? 0).toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Button
                variant="contained"
                sx={{ marginTop: 2, backgroundColor: "#8884d8", "&:hover": { backgroundColor: "#6c6cc4" } }}
                onClick={exportToCSV}
            >
                Export CSV
            </Button>

        </Paper>
    );
};

export default SimulationTable;
