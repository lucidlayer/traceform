import React from 'react';
import './BuySellModal.css';

export const BuySellModal: React.FC<{
  open: boolean;
  stock: string | null;
  onClose: () => void;
  onBuySell: (stock: string, action: 'buy' | 'sell') => void;
}> = ({ open, stock, onClose, onBuySell }) => {
  if (!open || !stock) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Trade {stock}</h2>
        <div className="modal-actions">
          <button onClick={() => onBuySell(stock, 'buy')}>Buy</button>
          <button onClick={() => onBuySell(stock, 'sell')}>Sell</button>
        </div>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}; 