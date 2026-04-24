import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  fixturePayslipListItems,
  fixturePayslipDetail,
} from '../fixtures/mock-data';

// ---------------------------------------------------------------------------
// PayslipSummaryCard — renders latest net pay
// ---------------------------------------------------------------------------

function PayslipSummaryCard({ netPay }: { netPay: number }) {
  return <div aria-label="Latest net pay">₦{netPay.toLocaleString()}</div>;
}

describe('PayslipSummaryCard', () => {
  it('renders formatted net pay', () => {
    render(<PayslipSummaryCard netPay={450000} />);
    expect(screen.getByLabelText('Latest net pay')).toHaveTextContent(
      '₦450,000'
    );
  });
});

// ---------------------------------------------------------------------------
// PayslipItemCard — renders period, net pay, status, view button
// ---------------------------------------------------------------------------

function PayslipItemCard({
  item,
  onView,
}: {
  item: (typeof fixturePayslipListItems)[0];
  onView: (id: string) => void;
}) {
  return (
    <div>
      <span>{item.periodLabel}</span>
      <span>₦{item.netPay.toLocaleString()}</span>
      <span data-testid="status">{item.status}</span>
      <button onClick={() => onView(item.id)}>View</button>
    </div>
  );
}

describe('PayslipItemCard', () => {
  const item = fixturePayslipListItems[0];

  it('renders period label', () => {
    render(<PayslipItemCard item={item} onView={() => {}} />);
    expect(screen.getByText('June 2025')).toBeInTheDocument();
  });

  it('renders formatted net pay', () => {
    render(<PayslipItemCard item={item} onView={() => {}} />);
    expect(screen.getByText('₦450,000')).toBeInTheDocument();
  });

  it('renders status badge', () => {
    render(<PayslipItemCard item={item} onView={() => {}} />);
    expect(screen.getByTestId('status')).toHaveTextContent('FINALIZED');
  });

  it('calls onView with correct id when View clicked', async () => {
    const onView = vi.fn();
    const { user } = render(<PayslipItemCard item={item} onView={onView} />);
    // Use userEvent when integrated; direct click here for unit test
    screen.getByRole('button', { name: 'View' }).click();
    expect(onView).toHaveBeenCalledWith('ps_01');
  });
});

// ---------------------------------------------------------------------------
// PayslipBreakdown — renders line items
// ---------------------------------------------------------------------------

function PayslipBreakdown({
  lines,
  variant,
}: {
  lines: { id: string; label: string; amount: number }[];
  variant: 'earnings' | 'deductions';
}) {
  return (
    <table aria-label={variant}>
      <tbody>
        {lines.map((line) => (
          <tr key={line.id}>
            <td>{line.label}</td>
            <td>₦{line.amount.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

describe('PayslipBreakdown', () => {
  it('renders all earnings lines', () => {
    render(
      <PayslipBreakdown
        lines={fixturePayslipDetail.earnings}
        variant="earnings"
      />
    );
    expect(screen.getByText('Basic Salary')).toBeInTheDocument();
    expect(screen.getByText('Housing Allowance')).toBeInTheDocument();
  });

  it('renders all deduction lines', () => {
    render(
      <PayslipBreakdown
        lines={fixturePayslipDetail.deductions}
        variant="deductions"
      />
    );
    expect(screen.getByText('PAYE Tax')).toBeInTheDocument();
    expect(screen.getByText('Pension (Employee)')).toBeInTheDocument();
  });

  it('formats amounts correctly', () => {
    render(
      <PayslipBreakdown
        lines={fixturePayslipDetail.earnings}
        variant="earnings"
      />
    );
    expect(screen.getByText('₦450,000')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// PayslipEmptyState
// ---------------------------------------------------------------------------

function PayslipEmptyState() {
  return <p>No payslips available yet.</p>;
}

describe('PayslipEmptyState', () => {
  it('renders empty state message', () => {
    render(<PayslipEmptyState />);
    expect(screen.getByText('No payslips available yet.')).toBeInTheDocument();
  });
});
