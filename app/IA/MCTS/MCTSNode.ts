import GameState from "@/app/GameControllers/GameState/GameStateInterface";
import generateUUID from "@/app/utils/UUIDGenerator";

export default class MCTSNode
{
  mHash: string = "";
  mParentNodeHash: string = "";
  mChildrenNodes: Set<MCTSNode> = new Set();
  mGameState: GameState;
  mWi: number = 0; // this node’s number of simulations that resulted in a win
  mSi: number = 0; // this node’s total number of simulations

  constructor(gameState: GameState, parentNodeHash: string)
  {
    //console.log(`MCTSNode: constructor: hash: ${this.mHash} parentNodeHash: ${parentNodeHash}`);
    this.mGameState = gameState;
    this.mHash = generateUUID();
    if (parentNodeHash)
    {
      this.mParentNodeHash = parentNodeHash;
    }
  }

  public isLeaf(): boolean
  {
    return this.mGameState.isTerminal();
  }

  public isRootNode(): boolean
  {
    return this.mParentNodeHash.length === 0;
  }

  public getState(): GameState
  {
    return this.mGameState;
  }

  public getHash(): string
  {
    return this.mHash;
  }

  public getParentNodeHash(): string
  {
    return this.mParentNodeHash;
  }

  public addChildNodeHash(childNode: MCTSNode): void
  {
    //console.log(`MCTSNode: addChildNodeHash: ${childNode.getHash()}`);
    this.mChildrenNodes.add(childNode);
  }

  public getChildrenNodes(): MCTSNode[]
  {
    return [...this.mChildrenNodes];
  }

  public hasChildrenNodes(): boolean
  {
    return this.mChildrenNodes.size > 0;
  }

  public getUnexpandedLegalPlays(): GameState[]
  {
    //console.log(`MTCSNode - begin: getUnexpandedLegalPlays: ${this.mHash}`);
    //console.log(`MCTSNode: ${this.mHash} begin: gameState: ${this.mGameState.getBoardState().toString()} childrenNodesLength: ${this.mChildrenNodes.size}`);
    const legalPlays = this.mGameState.getLegalPlays();
    const unexpandedLegalPlays = legalPlays.filter((legalPlay: GameState) => {
      //console.log(`MCTSNode: getUnexpandedLegalPlays: legalPlayBoard: ${legalPlay.getBoardState().toString()}`);

      for (let childNode of this.mChildrenNodes)
      {
        //console.log(`MCTSNode: getUnexpandedLegalPlays: childNodeBoard: ${childNode.getState().getBoardState().toString()}`);

        if (childNode.getState().getBoardState().toString() === legalPlay.getBoardState().toString())
        {
          return false;
        }
      }
      return true;
    });
    //console.log(`MCTSNode: ${this.mHash} end: gameState: ${this.mGameState.getBoardState().toString()} getUnexpandedLegalPlays: legalPlays: ${legalPlays.length} | unexpandedLegalPlays: ${unexpandedLegalPlays.length} childrenNodesLength: ${this.mChildrenNodes.size}`);
    //console.log(`MTCSNode - end`);
    return unexpandedLegalPlays;
  }

  public isFullyExpanded(): boolean
  {
    //console.log(`MCTSNode isFullyExpanded`);
    return this.getUnexpandedLegalPlays().length === 0;
  }

  public getWi(): number
  {
    return this.mWi;
  }
  
  public setWi(): void
  {
    this.mWi++;
    //console.log(`MCTSNode: setWi: wi: ${this.mWi}`);
  }

  public getSi(): number
  {
    return this.mSi;
  }

  public setSi(): void
  {
    this.mSi++;
    //console.log(`MCTSNode: setSi: si: ${this.mSi}`);
  }
}