/**
 * Abstract base class for logger transports.
 * Implementations broadcast log messages to external reporting systems.
 * All methods are no-ops by default — override only the ones you need.
 */
export class LogTransport {
  info(_message) {}
  debug(_message) {}
  warn(_message) {}
  error(_message) {}
  trace(_message) {}
  screenshot(_name, _buffer) {}
  testStart(_name) {}
  testEnd(_name, _status) {}
}
