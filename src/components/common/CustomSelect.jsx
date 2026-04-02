import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import './CustomSelect.css';

export default function CustomSelect({ value, onChange, options, placeholder = 'Select...' }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find(o => o.value === value);
  const displayLabel = selectedOption?.label || placeholder;

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  function handleSelect(optionValue) {
    onChange(optionValue);
    setOpen(false);
  }

  return (
    <div className="custom-select" ref={containerRef}>
      <button
        type="button"
        className={`custom-select__trigger ${open ? 'custom-select__trigger--open' : ''}`}
        onClick={() => setOpen(prev => !prev)}
      >
        <span className={value === 'all' || !value ? 'custom-select__placeholder' : ''}>
          {displayLabel}
        </span>
        <ChevronDown size={15} className={`custom-select__chevron ${open ? 'custom-select__chevron--open' : ''}`} />
      </button>

      {open && (
        <div className="custom-select__dropdown">
          <div className="custom-select__list">
            {options.map(option => (
              <button
                key={option.value}
                type="button"
                className={`custom-select__option ${option.value === value ? 'custom-select__option--selected' : ''}`}
                onClick={() => handleSelect(option.value)}
              >
                <span>{option.label}</span>
                {option.value === value && <Check size={14} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
