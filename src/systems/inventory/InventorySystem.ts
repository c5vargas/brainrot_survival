export class InventorySystem {
  private static instance: InventorySystem;
  private items: number[] = [];

  public static getInstance(): InventorySystem {
      if (!InventorySystem.instance) {
          InventorySystem.instance = new InventorySystem();
      }
      return InventorySystem.instance;
  }
}