import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

export default function CompanyManagement() {
    const [companies, setCompanies] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    // Lấy danh sách công ty từ BE khi load trang
    useEffect(() => {
        axios.get('http://localhost:9999/api/v1/account-companies')
            .then(res => setCompanies(Array.isArray(res.data) ? res.data : []))
            .catch(() => setCompanies([]));
    }, []);

    const handleOpenDialog = (company = null) => {
        setEditingCompany(company);
        setFormData(company
            ? { ...company, username: company.accountId?.username || '', password: '', confirmPassword: '' }
            : { name: '', address: '', email: '', username: '', password: '', confirmPassword: '' }
        );
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setFormData({ name: '', address: '', email: '', username: '', password: '', confirmPassword: '' });
        setEditingCompany(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!editingCompany) {
            // Kiểm tra password và confirmPassword
            if (formData.password !== formData.confirmPassword) {
                alert('Mật khẩu và xác nhận mật khẩu không khớp!');
                return;
            }
            try {
                const res = await axios.post('http://localhost:9999/api/v1/account-companies', {
                    name: formData.name,
                    address: formData.address,
                    email: formData.email,
                    username: formData.username,
                    password: formData.password
                });
                alert(res.data.message || 'Thêm mới thành công!');
                const resList = await axios.get('http://localhost:9999/api/v1/account-companies');
                setCompanies(Array.isArray(resList.data) ? resList.data : []);
                handleCloseDialog();
            } catch (err) {
                console.error(err);
                if (err.response?.data?.error?.includes('duplicate')) {
                    alert('Username đã tồn tại!');
                } else {
                    alert('Thêm công ty thất bại!');
                }
            }
        } else {
            try {
                const res = await axios.put(`http://localhost:9999/api/v1/account-companies/${editingCompany._id}`, {
                    name: formData.name,
                    address: formData.address,
                    email: formData.email,
                    username: formData.username
                });
                alert(res.data.message || 'Cập nhật thành công!');
                const resList = await axios.get('http://localhost:9999/api/v1/account-companies');
                setCompanies(Array.isArray(resList.data) ? resList.data : []);
                handleCloseDialog();
            } catch (err) {
                alert('Cập nhật công ty thất bại!');
            }
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa công ty này?')) return;
        try {
            const res = await axios.delete(`http://localhost:9999/api/v1/account-companies/${id}`);
            alert(res.data.message || 'Xóa thành công!');
            setCompanies(prev => prev.filter(c => c._id !== id));
        } catch (err) {
            alert('Xóa công ty thất bại!');
        }
    };

    return (
        <Box>
            <Typography variant="h5" fontWeight={600} mb={2}>Company Management</Typography>
            <Paper sx={{ p: 3 }}>
                <Box display="flex" justifyContent="flex-end" mb={2}>
                    <Button variant="contained" onClick={() => handleOpenDialog()}>Add Company</Button>
                </Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {companies.map((company) => (
                            <TableRow key={company._id}>
                                <TableCell>{company.name}</TableCell>
                                <TableCell>{company.address}</TableCell>
                                <TableCell>{company.email}</TableCell>
                                <TableCell>{company.accountId?.username || ''}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleOpenDialog(company)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(company._id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>{editingCompany ? 'Edit Company' : 'Add Company'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Company Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    {!editingCompany && (
                        <>
                            <TextField
                                margin="dense"
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                            <TextField
                                margin="dense"
                                label="Confirm Password"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
