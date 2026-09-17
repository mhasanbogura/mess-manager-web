.class public final enum La01;
.super Ljava/lang/Enum;
.source "r8-map-id-e0518cc6312f1953c5164e252674cfa64754ff40b09b1c315a60eb336e5a265a"


# static fields
.field public static final synthetic b:[La01;


# instance fields
.field public final a:I


# direct methods
.method static constructor <clinit>()V
    .locals 4

    .line 1
    new-instance v0, La01;

    .line 2
    .line 3
    const-string v1, "STANDARD"

    .line 4
    .line 5
    const/4 v2, 0x0

    .line 6
    invoke-direct {v0, v1, v2, v2}, La01;-><init>(Ljava/lang/String;II)V

    .line 7
    .line 8
    .line 9
    new-instance v1, La01;

    .line 10
    .line 11
    const-string v2, "GAMES"

    .line 12
    .line 13
    const/4 v3, 0x1

    .line 14
    invoke-direct {v1, v2, v3, v3}, La01;-><init>(Ljava/lang/String;II)V

    .line 15
    .line 16
    .line 17
    filled-new-array {v0, v1}, [La01;

    .line 18
    .line 19
    .line 20
    move-result-object v0

    .line 21
    sput-object v0, La01;->b:[La01;

    .line 22
    .line 23
    return-void
.end method

.method public constructor <init>(Ljava/lang/String;II)V
    .locals 0

    .line 1
    invoke-direct {p0, p1, p2}, Ljava/lang/Enum;-><init>(Ljava/lang/String;I)V

    .line 2
    .line 3
    .line 4
    iput p3, p0, La01;->a:I

    .line 5
    .line 6
    return-void
.end method

.method public static valueOf(Ljava/lang/String;)La01;
    .locals 1

    .line 1
    const-class v0, La01;

    .line 2
    .line 3
    invoke-static {v0, p0}, Ljava/lang/Enum;->valueOf(Ljava/lang/Class;Ljava/lang/String;)Ljava/lang/Enum;

    .line 4
    .line 5
    .line 6
    move-result-object p0

    .line 7
    check-cast p0, La01;

    .line 8
    .line 9
    return-object p0
.end method

.method public static values()[La01;
    .locals 1

    .line 1
    sget-object v0, La01;->b:[La01;

    .line 2
    .line 3
    invoke-virtual {v0}, [La01;->clone()Ljava/lang/Object;

    .line 4
    .line 5
    .line 6
    move-result-object v0

    .line 7
    check-cast v0, [La01;

    .line 8
    .line 9
    return-object v0
.end method
