import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
interface Props { children: ReactNode }
interface State { failed: boolean }
export default class PaymentErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };
  static getDerivedStateFromError(): State { return { failed: true }; }
  componentDidCatch(_error: Error, info: ErrorInfo) { console.error('Payment interface failed', info.componentStack); toast.error('The payment interface could not load. Retry or check your recharge history.'); }
  render() {
    if (!this.state.failed) return this.props.children;
    return <section role="alert" className="space-y-4 rounded-2xl border border-border bg-card p-6"><AlertCircle className="text-primary" /><h1 className="text-2xl font-semibold">Recharge interface unavailable</h1><p className="text-muted-foreground">Your Cloud payment records are preserved. Do not submit a duplicate payment.</p><Button variant="outline" onClick={() => this.setState({ failed: false })} className="min-h-12 rounded-xl">Retry recharge screen</Button></section>;
  }
}
