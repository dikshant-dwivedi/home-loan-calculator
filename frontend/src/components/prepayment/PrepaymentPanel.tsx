'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PrepaymentType, ImpactStrategy, type PrepaymentAction } from '@/types';
import { formatIndianCurrency } from '@/lib/utils/formatting';

interface PrepaymentPanelProps {
  prepayments: PrepaymentAction[];
  onPrepaymentsChange: (prepayments: PrepaymentAction[]) => void;
  maxTenure: number;
}

interface PrepaymentFormData {
  type: PrepaymentType;
  startMonth?: number;
  endMonth?: number;
  extraAmountPerMonth?: number;
  paymentMonth?: number;
  lumpsumAmount?: number;
  missedMonth?: number;
  penaltyAmount?: number;
  impactStrategy: ImpactStrategy;
}

export function PrepaymentPanel({ prepayments, onPrepaymentsChange, maxTenure }: PrepaymentPanelProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PrepaymentFormData>({
    type: PrepaymentType.PERIODIC_EXTRA,
    impactStrategy: ImpactStrategy.REDUCE_TENURE,
  });

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      type: PrepaymentType.PERIODIC_EXTRA,
      impactStrategy: ImpactStrategy.REDUCE_TENURE,
    });
  };

  const handleEdit = (prepayment: PrepaymentAction) => {
    setIsAdding(true);
    setEditingId(prepayment.id);
    setFormData({
      type: prepayment.type,
      startMonth: prepayment.startMonth,
      endMonth: prepayment.endMonth,
      extraAmountPerMonth: prepayment.extraAmountPerMonth,
      paymentMonth: prepayment.paymentMonth,
      lumpsumAmount: prepayment.lumpsumAmount,
      missedMonth: prepayment.missedMonth,
      penaltyAmount: prepayment.penaltyAmount,
      impactStrategy: prepayment.impactStrategy,
    });
  };

  const handleDelete = (id: string) => {
    onPrepaymentsChange(prepayments.filter(p => p.id !== id));
  };

  const handleSave = () => {
    const newPrepayment: PrepaymentAction = {
      id: editingId || `prepayment-${Date.now()}`,
      ...formData,
    };

    if (editingId) {
      onPrepaymentsChange(prepayments.map(p => p.id === editingId ? newPrepayment : p));
    } else {
      onPrepaymentsChange([...prepayments, newPrepayment]);
    }

    setIsAdding(false);
    setEditingId(null);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  const getPrepaymentLabel = (prepayment: PrepaymentAction): string => {
    switch (prepayment.type) {
      case PrepaymentType.PERIODIC_EXTRA:
        return `Extra ${formatIndianCurrency(prepayment.extraAmountPerMonth || 0)}/month (Month ${prepayment.startMonth}-${prepayment.endMonth})`;
      case PrepaymentType.LUMPSUM:
        return `Lumpsum ${formatIndianCurrency(prepayment.lumpsumAmount || 0)} (Month ${prepayment.paymentMonth})`;
      case PrepaymentType.MISSED_PAYMENT:
        return `Missed Payment (Month ${prepayment.missedMonth}) - Penalty ${formatIndianCurrency(prepayment.penaltyAmount || 0)}`;
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Prepayment Configuration</h3>
        {!isAdding && (
          <Button onClick={handleAdd} size="sm">
            + Add Prepayment
          </Button>
        )}
      </div>

      {prepayments.length === 0 && !isAdding && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
          <p className="text-sm">No prepayments configured</p>
          <p className="text-xs mt-1">Click "Add Prepayment" to start</p>
        </div>
      )}

      {prepayments.map((prepayment) => (
        <div key={prepayment.id} className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="font-medium text-sm">{getPrepaymentLabel(prepayment)}</div>
              <div className="text-xs text-gray-600 mt-1">
                Strategy: {prepayment.impactStrategy === ImpactStrategy.REDUCE_TENURE ? 'Reduce Tenure' : 'Reduce EMI'}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleEdit(prepayment)} variant="outline" size="sm">
                Edit
              </Button>
              <Button onClick={() => handleDelete(prepayment.id)} variant="destructive" size="sm">
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}

      {isAdding && (
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <h4 className="font-semibold mb-4">{editingId ? 'Edit Prepayment' : 'Add Prepayment'}</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Prepayment Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as PrepaymentType })}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value={PrepaymentType.PERIODIC_EXTRA}>Periodic Extra Payment</option>
                <option value={PrepaymentType.LUMPSUM}>Lumpsum Payment</option>
                <option value={PrepaymentType.MISSED_PAYMENT}>Missed Payment</option>
              </select>
            </div>

            {formData.type === PrepaymentType.PERIODIC_EXTRA && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Month</label>
                    <input
                      type="number"
                      min="1"
                      max={maxTenure}
                      value={formData.startMonth || ''}
                      onChange={(e) => setFormData({ ...formData, startMonth: parseInt(e.target.value) || undefined })}
                      className="w-full border rounded-md px-3 py-2"
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">End Month</label>
                    <input
                      type="number"
                      min="1"
                      max={maxTenure}
                      value={formData.endMonth || ''}
                      onChange={(e) => setFormData({ ...formData, endMonth: parseInt(e.target.value) || undefined })}
                      className="w-full border rounded-md px-3 py-2"
                      placeholder={maxTenure.toString()}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Extra Amount Per Month (₹)</label>
                  <input
                    type="number"
                    min="0"
                    max="100000"
                    step="1000"
                    value={formData.extraAmountPerMonth || ''}
                    onChange={(e) => setFormData({ ...formData, extraAmountPerMonth: parseInt(e.target.value) || undefined })}
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="10000"
                  />
                </div>
              </>
            )}

            {formData.type === PrepaymentType.LUMPSUM && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Payment Month</label>
                  <input
                    type="number"
                    min="1"
                    max={maxTenure}
                    value={formData.paymentMonth || ''}
                    onChange={(e) => setFormData({ ...formData, paymentMonth: parseInt(e.target.value) || undefined })}
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="36"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Lumpsum Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    max="5000000"
                    step="10000"
                    value={formData.lumpsumAmount || ''}
                    onChange={(e) => setFormData({ ...formData, lumpsumAmount: parseInt(e.target.value) || undefined })}
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="200000"
                  />
                </div>
              </>
            )}

            {formData.type === PrepaymentType.MISSED_PAYMENT && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Missed Month</label>
                  <input
                    type="number"
                    min="1"
                    max={maxTenure}
                    value={formData.missedMonth || ''}
                    onChange={(e) => setFormData({ ...formData, missedMonth: parseInt(e.target.value) || undefined })}
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="18"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Penalty Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    max="50000"
                    step="500"
                    value={formData.penaltyAmount || ''}
                    onChange={(e) => setFormData({ ...formData, penaltyAmount: parseInt(e.target.value) || undefined })}
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="5000"
                  />
                </div>
              </>
            )}

            {formData.type !== PrepaymentType.MISSED_PAYMENT && (
              <div>
                <label className="block text-sm font-medium mb-2">Impact Strategy</label>
                <select
                  value={formData.impactStrategy}
                  onChange={(e) => setFormData({ ...formData, impactStrategy: e.target.value as ImpactStrategy })}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value={ImpactStrategy.REDUCE_TENURE}>Reduce Tenure (Pay off faster)</option>
                  <option value={ImpactStrategy.REDUCE_EMI}>Reduce EMI (Lower monthly payment)</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <Button onClick={handleSave} className="flex-1">
              {editingId ? 'Update' : 'Add'} Prepayment
            </Button>
            <Button onClick={handleCancel} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
