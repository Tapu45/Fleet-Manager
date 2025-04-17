import React, { useState, useEffect } from 'react';
import { addVehicle, getVehiclesByOwner, removeVehicle } from '../../utils/api';
import { supabase } from '../../utils/supa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion, AnimatePresence } from 'framer-motion';

const AddVehiclePage: React.FC = () => {
  interface Vehicle {
    id: number;
    chassisNo: string;
    regdNo: string;
  }

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [formData, setFormData] = useState({
    ownerId: 0,
    chassisNo: '',
    engineNo: '',
    regdNo: '',
    fuelType: '',
    insuranceCompany: '',
    insurancePolicyNo: '',
    insuranceValidUpto: new Date(),
    puccNo: '',
    puccValidUpto: new Date(),
    insuranceDocument: '',
    pucDocument: '',
  });

  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const loggedInOwnerId = localStorage.getItem('userId');
    setFormData((prev) => ({ ...prev, ownerId: parseInt(loggedInOwnerId || '0', 10) }));
  }, []);

  const fetchVehicles = async () => {
    try {
      if (formData.ownerId) {
        const response = await getVehiclesByOwner(formData.ownerId);
        setVehicles(response.data.vehicles);
      }
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    }
  };

  useEffect(() => {
    if (formData.ownerId) {
      fetchVehicles();
    }
  }, [formData.ownerId]);

  const uploadFileToSupabase = async (file: File, folder: string) => {
    const fileName = `${folder}/${Date.now()}_${file.name}`;
    const {  error } = await supabase.storage.from('uploads').upload(fileName, file);

    if (error) {
      console.error('File upload failed:', error);
      throw new Error('File upload failed');
    }

    const { data: publicUrlData } = supabase.storage.from('uploads').getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      try {
        const folder = name === 'insuranceDocument' ? 'insurance-documents' : 'puc-documents';
        const uploadedFileUrl = await uploadFileToSupabase(files[0], folder);

        setFormData((prev) => ({
          ...prev,
          [name]: uploadedFileUrl,
        }));

        alert(`${name === 'insuranceDocument' ? 'Insurance Document' : 'PUC Document'} uploaded successfully!`);
      } catch (error) {
        console.error('File upload error:', error);
        alert('Failed to upload file. Please try again.');
      }
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await addVehicle({
        ...formData,
        insuranceValidUpto: formData.insuranceValidUpto.toISOString().split('T')[0],
        puccValidUpto: formData.puccValidUpto.toISOString().split('T')[0],
      });
      setVehicles((prev) => [...prev, response.data.vehicle]);
      setFormData({
        ...formData,
        chassisNo: '',
        engineNo: '',
        regdNo: '',
        fuelType: '',
        insuranceCompany: '',
        insurancePolicyNo: '',
        insuranceValidUpto: new Date(),
        puccNo: '',
        puccValidUpto: new Date(),
        insuranceDocument: '',
        pucDocument: '',
      });
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      console.error('Failed to add vehicle:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVehicle = async (vehicleId: number) => {
    try {
      await removeVehicle(vehicleId);
      setVehicles((prev) => prev.filter((vehicle: any) => vehicle.id !== vehicleId));
    } catch (error) {
      console.error('Failed to delete vehicle:', error);
    }
  };

  const handleDateChange = (date: Date | null, fieldName: string) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: date,
      }));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          width: '100%',
          maxWidth: '850px',
          padding: '40px',
          overflow: 'hidden',
        }}
      >
        <motion.div variants={fadeIn}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#1E3A8A',
              textAlign: 'center',
              marginBottom: '32px',
              position: 'relative',
            }}
          >
            Add Vehicle
            <div
              style={{
                height: '4px',
                width: '60px',
                background: 'linear-gradient(90deg, #1E3A8A, #3B82F6)',
                borderRadius: '2px',
                margin: '12px auto 0',
              }}
            />
          </h1>
        </motion.div>

        <motion.form 
          onSubmit={handleAddVehicle} 
          style={{ display: 'flex', flexDirection: 'column', gap: '20px' , marginRight: '40px', marginLeft: '-20px' }}
          variants={containerVariants}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px',  }}>
          {[
  { name: 'chassisNo', placeholder: 'Chassis Number', value: formData.chassisNo },
  { name: 'engineNo', placeholder: 'Engine Number', value: formData.engineNo },
  { name: 'regdNo', placeholder: 'Registration Number', value: formData.regdNo },
  { name: 'fuelType', placeholder: 'Fuel Type', value: formData.fuelType },
  { name: 'insuranceCompany', placeholder: 'Insurance Company', value: formData.insuranceCompany },
  { name: 'insurancePolicyNo', placeholder: 'Insurance Policy Number', value: formData.insurancePolicyNo },
  { name: 'puccNo', placeholder: 'PUC Certificate Number', value: formData.puccNo },
].map((field, idx) => (
  <motion.div key={idx} variants={itemVariants}>
    <label
      style={{
        display: 'block',
        marginBottom: '10px', // Added margin for spacing
        fontSize: '14px',
        fontWeight: '500',
        color: '#1E3A8A',
      }}
    >
      {field.placeholder}
    </label>
    <input
      type="text"
      name={field.name}
      placeholder={field.placeholder}
      value={field.value}
      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
      required
      style={{
        width: '100%',
        padding: '12px 16px',
        marginBottom: '20px', // Added margin for spacing between inputs
        border: '1px solid #CBD5E1',
        borderRadius: '8px',
        outline: 'none',
        fontSize: '14px',
        transition: 'all 0.3s',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      }}
    />
  </motion.div>
))}
            
            <motion.div variants={itemVariants}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#1E3A8A',
                }}
              >
                Insurance Valid Upto
              </label>
              <DatePicker
                selected={formData.insuranceValidUpto}
                onChange={(date) => handleDateChange(date, 'insuranceValidUpto')}
                dateFormat="dd/MM/yyyy"
                className="date-picker custom-date-picker"
                required
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#1E3A8A',
                }}
              >
                PUC Valid Upto
              </label>
              <DatePicker
  selected={formData.puccValidUpto}
  onChange={(date) => handleDateChange(date, 'puccValidUpto')}
  dateFormat="dd/MM/yyyy"
  className="date-picker custom-date-picker"
  required
/>
            </motion.div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' }}>
            <motion.div variants={itemVariants}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#1E3A8A' }}>
                Insurance Document
              </label>
              <div
                style={{
                  position: 'relative',
                  padding: '12px',
                  border: '1px dashed #3B82F6',
                  borderRadius: '8px',
                  backgroundColor: '#EFF6FF',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="file"
                  name="insuranceDocument"
                  onChange={handleFileUpload}
                  style={{
                    opacity: 0,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer',
                  }}
                />
                <span style={{ color: '#3B82F6', fontWeight: '500' }}>
                  {formData.insuranceDocument ? '✓ Document Uploaded' : 'Click to upload'}
                </span>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#1E3A8A' }}>
                PUC Document
              </label>
              <div
                style={{
                  position: 'relative',
                  padding: '12px',
                  border: '1px dashed #3B82F6',
                  borderRadius: '8px',
                  backgroundColor: '#EFF6FF',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="file"
                  name="pucDocument"
                  onChange={handleFileUpload}
                  style={{
                    opacity: 0,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer',
                  }}
                />
                <span style={{ color: '#3B82F6', fontWeight: '500' }}>
                  {formData.pucDocument ? '✓ Document Uploaded' : 'Click to upload'}
                </span>
              </div>
            </motion.div>
          </div>

          <motion.div 
            variants={itemVariants}
            style={{ marginTop: '20px' }}
          >
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%',
                backgroundColor: '#1E3A8A',
                color: '#ffffff',
                padding: '14px',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg
                    style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      opacity="0.25"
                    />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Adding...
                </span>
              ) : (
                'Add Vehicle'
              )}
            </motion.button>
          </motion.div>
        </motion.form>

        <AnimatePresence>
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                marginTop: '20px',
                padding: '12px 16px',
                backgroundColor: '#DCFCE7',
                color: '#166534',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '500',
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                style={{ marginRight: '8px' }}
              >
                <path
                  d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
                  stroke="#166534"
                  strokeWidth="2"
                  fill="#DCFCE7"
                />
                <path
                  d="M7 10L9 12L13 8"
                  stroke="#166534"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Vehicle added successfully!
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          variants={fadeIn}
          style={{
            marginTop: '40px',
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1E3A8A',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M8 19H5C3.89543 19 3 18.1046 3 17V7C3 5.89543 3.89543 5 5 5H8M8 19V5M8 19H16M8 5H16M16 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H16M16 19V5"
                stroke="#1E3A8A"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Vehicle List {vehicles.length > 0 && <span style={{ fontSize: '16px', color: '#3B82F6' }}>({vehicles.length})</span>}
          </h2>

          <AnimatePresence>
  {vehicles.length === 0 ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        padding: '24px',
        textAlign: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: '8px',
        color: '#64748B',
      }}
    >
      No vehicles added yet. Add your first vehicle above.
    </motion.div>
  ) : (
    <motion.ul
      style={{ listStyleType: 'none', padding: '0', margin: '0' }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {vehicles.map((vehicle: any, index) => (
        <motion.li
          key={vehicle.id}
          variants={itemVariants}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            marginBottom: '12px',
            backgroundColor: '#EFF6FF',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          whileHover={{
            y: -4,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div>
            <span style={{ color: '#1E3A8A', fontWeight: 'bold', fontSize: '16px', display: 'block' }}>
              {vehicle.regdNo}
            </span>
            <span style={{ color: '#4B5563', fontSize: '14px', display: 'block', marginTop: '4px' }}>
              Chassis: {vehicle.chassisNo}
            </span>
            <span style={{ color: '#4B5563', fontSize: '14px', display: 'block', marginTop: '4px' }}>
              Insurance Document: 
              {vehicle.insuranceDocument ? (
                <a
                  href={vehicle.insuranceDocument}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#3B82F6', textDecoration: 'underline', marginLeft: '4px' }}
                >
                  View
                </a>
              ) : (
                <span style={{ color: '#DC2626', marginLeft: '4px' }}>Not Uploaded</span>
              )}
            </span>
            <span style={{ color: '#4B5563', fontSize: '14px', display: 'block', marginTop: '4px' }}>
              PUC Document: 
              {vehicle.pucDocument ? (
                <a
                  href={vehicle.pucDocument}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#3B82F6', textDecoration: 'underline', marginLeft: '4px' }}
                >
                  View
                </a>
              ) : (
                <span style={{ color: '#DC2626', marginLeft: '4px' }}>Not Uploaded</span>
              )}
            </span>
          </div>
          <motion.button
            onClick={() => handleDeleteVehicle(vehicle.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              backgroundColor: '#FEE2E2',
              color: '#DC2626',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
              border: 'none',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M13.3332 4.00001L12.2665 13.0667C12.2221 13.5578 12.0017 14.0156 11.6432 14.3505C11.2846 14.6854 10.8116 14.8752 10.3198 14.8867H5.67984C5.18805 14.8752 4.71503 14.6854 4.35648 14.3505C3.99793 14.0156 3.77756 13.5578 3.73317 13.0667L2.6665 4.00001M5.99984 7.33334V11.3333M9.99984 7.33334V11.3333M10.6665 4.00001V2.00001C10.6665 1.82319 10.5958 1.65362 10.4708 1.5286C10.3458 1.40358 10.1762 1.33334 9.99984 1.33334H5.99984C5.82303 1.33334 5.65346 1.40358 5.52843 1.5286C5.40341 1.65362 5.33317 1.82319 5.33317 2.00001V4.00001M2.6665 4.00001H13.3332"
                stroke="#DC2626"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Delete
          </motion.button>
        </motion.li>
      ))}
    </motion.ul>
  )}
</AnimatePresence>
        </motion.div>

        <style>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          
          .date-picker {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid #CBD5E1;
            border-radius: 8px;
            outline: none;
            font-size: 14px;
          .custom-date-picker {
          }
          
          .date-picker:focus {
            border-color: #3B82F6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
          }
          .custom-date-picker {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid #CBD5E1;
            border-radius: 8px;
            outline: none;
            font-size: 14px;
          }
            width: 100%;
          }
          
          .react-datepicker__header {
            background-color: #1E3A8A !important;
            border-bottom: none !important;
          }
          
          .react-datepicker__current-month,
          .react-datepicker__day-name {
            color: white !important;
          }
          
          .react-datepicker__day--selected {
            background-color: #3B82F6 !important;
          }
          
          .react-datepicker__day:hover {
            background-color: #DBEAFE !important;
          }
        `}</style>
      </motion.div>
    </div>
  );
};

export default AddVehiclePage;