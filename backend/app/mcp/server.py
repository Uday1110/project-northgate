"""
MCP Server implementation exposing the four gated tools.
PROVISIONAL-GAP-3: Build an MCP server exposing the gated tools Identity service,
Case system, Notifications, and Public registries (the fourth tool resolves gap 4).
The Orchestrator and KYC agent reach external systems only through it.
"""

from typing import Dict, Any, List
from app.mcp.tools.identity_service import IdentityServiceTool
from app.mcp.tools.public_registries import PublicRegistriesTool
from app.mcp.tools.case_system import CaseSystemTool
from app.mcp.tools.notifications import NotificationsTool

class MCPServer:
    """
    Model Context Protocol (MCP) server managing gated tool execution.
    """
    def __init__(self):
        self.identity_service = IdentityServiceTool()
        self.public_registries = PublicRegistriesTool()
        self.case_system = CaseSystemTool()
        self.notifications = NotificationsTool()
        self._tools = {
            "identity_service": self.identity_service,
            "public_registries": self.public_registries,
            "case_system": self.case_system,
            "notifications": self.notifications
        }

    def list_tools(self) -> List[str]:
        return list(self._tools.keys())

    def call_tool(self, tool_name: str, method_name: str, **kwargs) -> Any:
        if tool_name not in self._tools:
            raise KeyError(f"Tool '{tool_name}' not hosted on MCP Server.")
        tool = self._tools[tool_name]
        if not hasattr(tool, method_name):
            raise AttributeError(f"Tool '{tool_name}' does not implement method '{method_name}'.")
        method = getattr(tool, method_name)
        return method(**kwargs)
